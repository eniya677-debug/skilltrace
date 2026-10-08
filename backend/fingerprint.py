import re
import json
from typing import Dict, Any

def normalize_stack_trace(stack_trace: str) -> str:
    if not stack_trace:
        return ""
    # Strip line numbers `:\d+`
    cleaned = re.sub(r':\d+', '', stack_trace)
    # Strip hex memory addresses `0x[0-9a-fA-F]+`
    cleaned = re.sub(r'0x[0-9a-fA-F]+', '', cleaned)
    # Convert to lowercase
    cleaned = cleaned.lower().strip()
    # Truncate to 300 chars
    return cleaned[:300]

def create_fingerprint(service: str, endpoint: str, error_type: str, http_status: int, stack_trace: str) -> Dict[str, Any]:
    trace_sig = normalize_stack_trace(stack_trace)
    return {
        "service": service.lower().strip(),
        "endpoint": endpoint.lower().strip(),
        "error_type": error_type.lower().strip(),
        "http_status": http_status,
        "trace_signature": trace_sig
    }

def fingerprint_to_json(fp: Dict[str, Any]) -> str:
    return json.dumps(fp, sort_keys=True)

def json_to_fingerprint(fp_json: str) -> Dict[str, Any]:
    try:
        return json.loads(fp_json)
    except Exception:
        return {}
