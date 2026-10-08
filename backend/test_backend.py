import sys
from pathlib import Path
from fastapi.testclient import TestClient

backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from main import app
from seed import seed_database

def test_api():
    print("--- 1. Seeding database ---")
    seed_database()

    client = TestClient(app)

    print("\n--- 2. Testing GET /health ---")
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}
    print("Health check passed:", res.json())

    print("\n--- 3. Testing GET /incidents ---")
    res = client.get("/incidents")
    assert res.status_code == 200
    incidents = res.json()
    print(f"Total incidents retrieved: {len(incidents)}")
    assert len(incidents) >= 9

    print("\n--- 4. Testing POST /incident with SIMILAR payment-service DB timeout ---")
    similar_payload = {
        "service": "payment-service",
        "endpoint": "/api/v1/charge",
        "http_status": 504,
        "error_type": "DatabaseTimeoutError",
        "stack_trace": "Connection pool exhausted after 30000ms at db/pool.py:150 in acquire_connection()"
    }
    res = client.post("/incident", json=similar_payload)
    assert res.status_code == 201
    data = res.json()
    new_id = data["incident_id"]
    matches = data["matches"]
    print(f"New Incident #{new_id} ingested.")
    print(f"Matches found: {len(matches)}")
    assert len(matches) > 0
    top_match = matches[0]
    print(f"Top match: Incident #{top_match['incident_id']} with score {top_match['score']}%")
    print(f"  Root cause: {top_match['root_cause']}")
    print(f"  Fix: {top_match['fix_description']}")
    assert top_match["score"] >= 50.0

    print("\n--- 5. Testing POST /incident with UNRELATED failure ---")
    unrelated_payload = {
        "service": "billing-service",
        "endpoint": "/api/v2/invoice/export",
        "http_status": 403,
        "error_type": "S3AccessDeniedException",
        "stack_trace": "AccessDenied: User arn:aws:iam::1234:user/billing is not authorized to perform: s3:GetObject on resource arn:aws:s3:::invoices-bucket/2026/08"
    }
    res = client.post("/incident", json=unrelated_payload)
    assert res.status_code == 201
    unrelated_data = res.json()
    print(f"Unrelated Incident #{unrelated_data['incident_id']} ingested.")
    print(f"Matches found: {len(unrelated_data['matches'])}")
    assert len(unrelated_data["matches"]) == 0

    print("\n--- 6. Testing POST /incidents/{id}/resolve (Golden Rule verification) ---")
    resolve_payload = {
        "outcome": "reused",
        "root_cause": top_match["root_cause"],
        "fix_description": top_match["fix_description"],
        "pr_link": top_match["pr_link"]
    }
    res = client.post(f"/incidents/{new_id}/resolve", json=resolve_payload)
    assert res.status_code == 200
    resolved = res.json()
    print(f"Incident #{new_id} resolution response:")
    print(f"  Outcome: {resolved['outcome']}")
    assert resolved["outcome"] == "reused"

    print("\nSUCCESS: All backend API and similarity tests passed clean!")

if __name__ == "__main__":
    test_api()
