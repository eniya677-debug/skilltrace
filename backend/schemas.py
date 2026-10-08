from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class IncidentCreate(BaseModel):
    service: str = Field(..., example="payment-service")
    endpoint: str = Field(..., example="/api/v1/charge")
    http_status: int = Field(default=500, example=500)
    error_type: str = Field(..., example="DatabaseTimeoutError")
    stack_trace: str = Field(..., example="Connection pool exhausted after 30000ms at db/pool.py:142")

class IncidentResolve(BaseModel):
    outcome: str = Field(..., example="reused")  # "solved" or "reused"
    root_cause: Optional[str] = Field(None, example="Database connection pool size too small under peak traffic.")
    fix_description: Optional[str] = Field(None, example="Increased DB pool size from 10 to 50 in pool config.")
    pr_link: Optional[str] = Field(None, example="https://github.com/org/repo/pull/104")

class MatchResult(BaseModel):
    incident_id: int
    score: float
    service: str
    endpoint: str
    error_type: str
    http_status: int
    root_cause: Optional[str] = None
    fix_description: Optional[str] = None
    pr_link: Optional[str] = None
    outcome: str
    created_at: str

class IncidentDetail(BaseModel):
    id: int
    service: str
    endpoint: str
    http_status: int
    error_type: str
    stack_trace: str
    fingerprint: str
    root_cause: Optional[str] = None
    fix_description: Optional[str] = None
    pr_link: Optional[str] = None
    outcome: str
    created_at: str

class IncidentIngestResponse(BaseModel):
    incident_id: int
    incident: IncidentDetail
    matches: List[MatchResult]
