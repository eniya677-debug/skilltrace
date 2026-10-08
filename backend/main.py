from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
import json
from contextlib import asynccontextmanager

from database import init_db, get_db_connection, dict_from_row
from schemas import IncidentCreate, IncidentResolve, IncidentDetail, IncidentIngestResponse, MatchResult
from fingerprint import create_fingerprint, fingerprint_to_json
from similarity import find_top_matches

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB on startup
    init_db()
    yield

app = FastAPI(
    title="IncidentLoop API",
    description="Backend API for IncidentLoop historical failure matching and resolution.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for local demo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}

@app.post("/incident", response_model=IncidentIngestResponse, status_code=status.HTTP_201_CREATED, tags=["Incidents"])
def ingest_incident(payload: IncidentCreate):
    fp = create_fingerprint(
        service=payload.service,
        endpoint=payload.endpoint,
        error_type=payload.error_type,
        http_status=payload.http_status,
        stack_trace=payload.stack_trace
    )
    fp_json = fingerprint_to_json(fp)

    conn = get_db_connection()
    cursor = conn.cursor()

    # Get non-open historical incidents for matching
    cursor.execute("SELECT * FROM incidents WHERE outcome != 'open'")
    historical_rows = cursor.fetchall()
    historical_incidents = [dict_from_row(row) for row in historical_rows]

    # Find top similarity matches
    matches = find_top_matches(fp, historical_incidents, threshold=50.0, limit=3)

    # Save the new incident as open
    cursor.execute("""
        INSERT INTO incidents (service, endpoint, http_status, error_type, stack_trace, fingerprint, outcome)
        VALUES (?, ?, ?, ?, ?, ?, 'open')
    """, (payload.service, payload.endpoint, payload.http_status, payload.error_type, payload.stack_trace, fp_json))
    
    conn.commit()
    new_id = cursor.lastrowid

    # Fetch inserted record
    cursor.execute("SELECT * FROM incidents WHERE id = ?", (new_id,))
    new_row = cursor.fetchone()
    conn.close()

    new_incident = dict_from_row(new_row)
    # Ensure created_at is string
    new_incident["created_at"] = str(new_incident["created_at"])

    return {
        "incident_id": new_id,
        "incident": new_incident,
        "matches": matches
    }

@app.get("/incidents", response_model=List[IncidentDetail], tags=["Incidents"])
def list_incidents():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM incidents ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()

    incidents = []
    for r in rows:
        d = dict_from_row(r)
        d["created_at"] = str(d["created_at"])
        incidents.append(d)
    return incidents

@app.get("/incidents/{incident_id}", response_model=IncidentDetail, tags=["Incidents"])
def get_incident(incident_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM incidents WHERE id = ?", (incident_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail=f"Incident #{incident_id} not found")
    
    d = dict_from_row(row)
    d["created_at"] = str(d["created_at"])
    return d

@app.post("/incidents/{incident_id}/resolve", response_model=IncidentDetail, tags=["Incidents"])
def resolve_incident(incident_id: int, payload: IncidentResolve):
    if payload.outcome not in ["solved", "reused"]:
        raise HTTPException(status_code=400, detail="Outcome must be either 'solved' or 'reused'")

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM incidents WHERE id = ?", (incident_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail=f"Incident #{incident_id} not found")

    cursor.execute("""
        UPDATE incidents
        SET outcome = ?,
            root_cause = ?,
            fix_description = ?,
            pr_link = ?
        WHERE id = ?
    """, (payload.outcome, payload.root_cause, payload.fix_description, payload.pr_link, incident_id))

    conn.commit()

    cursor.execute("SELECT * FROM incidents WHERE id = ?", (incident_id,))
    updated_row = cursor.fetchone()
    conn.close()

    d = dict_from_row(updated_row)
    d["created_at"] = str(d["created_at"])
    return d
