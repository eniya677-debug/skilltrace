from difflib import SequenceMatcher
from typing import Dict, Any, List
import json
from fingerprint import json_to_fingerprint

WEIGHTS = {
    "service": 0.25,
    "endpoint": 0.20,
    "error_type": 0.25,
    "http_status": 0.10,
    "trace_signature": 0.20
}

def string_similarity(s1: str, s2: str) -> float:
    if not s1 and not s2:
        return 1.0
    if not s1 or not s2:
        return 0.0
    return SequenceMatcher(None, str(s1).lower(), str(s2).lower()).ratio()

def compute_similarity(fp1: Dict[str, Any], fp2: Dict[str, Any]) -> float:
    s_service = string_similarity(fp1.get("service", ""), fp2.get("service", ""))
    s_endpoint = string_similarity(fp1.get("endpoint", ""), fp2.get("endpoint", ""))
    s_error_type = string_similarity(fp1.get("error_type", ""), fp2.get("error_type", ""))
    
    status1 = fp1.get("http_status")
    status2 = fp2.get("http_status")
    s_status = 1.0 if (status1 is not None and status1 == status2) else 0.0
    
    s_trace = string_similarity(fp1.get("trace_signature", ""), fp2.get("trace_signature", ""))
    
    weighted_score = (
        s_service * WEIGHTS["service"] +
        s_endpoint * WEIGHTS["endpoint"] +
        s_error_type * WEIGHTS["error_type"] +
        s_status * WEIGHTS["http_status"] +
        s_trace * WEIGHTS["trace_signature"]
    )
    
    return round(weighted_score * 100.0, 1)

def find_top_matches(target_fp: Dict[str, Any], candidate_incidents: List[Dict[str, Any]], threshold: float = 50.0, limit: int = 3) -> List[Dict[str, Any]]:
    results = []
    for inc in candidate_incidents:
        # Candidate must be solved or reused (non-open)
        if inc.get("outcome") == "open":
            continue
        
        cand_fp = json_to_fingerprint(inc.get("fingerprint", "{}"))
        score = compute_similarity(target_fp, cand_fp)
        
        if score >= threshold:
            match_item = {
                "incident_id": inc["id"],
                "score": score,
                "service": inc["service"],
                "endpoint": inc["endpoint"],
                "error_type": inc["error_type"],
                "http_status": inc["http_status"],
                "root_cause": inc.get("root_cause"),
                "fix_description": inc.get("fix_description"),
                "pr_link": inc.get("pr_link"),
                "outcome": inc.get("outcome"),
                "created_at": str(inc.get("created_at"))
            }
            results.append(match_item)
            
    # Sort descending by score
    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:limit]
