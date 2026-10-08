import sqlite3
import json
import os
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from database import init_db, get_db_connection
from fingerprint import create_fingerprint, fingerprint_to_json

SEED_DATA = [
    {
        "service": "payment-service",
        "endpoint": "/api/v1/charge",
        "http_status": 504,
        "error_type": "DatabaseTimeoutError",
        "stack_trace": "Connection pool exhausted after 30000ms at db/pool.py:142 in acquire_connection()",
        "root_cause": "DB connection pool exhausted during peak traffic due to unclosed cursors in charge pipeline.",
        "fix_description": "Increased DB pool max_size from 10 to 50 and added context manager for automatic connection release.",
        "pr_link": "https://github.com/company/payment-service/pull/142",
        "outcome": "solved"
    },
    {
        "service": "payment-service",
        "endpoint": "/api/v1/refund",
        "http_status": 502,
        "error_type": "StripeAPIClientError",
        "stack_trace": "Stripe API connection timed out (HTTP 504) at clients/stripe.py:88 in request()",
        "root_cause": "Stripe webhook callback listener blocked on synchronous retry without backoff.",
        "fix_description": "Added exponential backoff with jitter and 5000ms timeout for Stripe HTTP calls.",
        "pr_link": "https://github.com/company/payment-service/pull/189",
        "outcome": "solved"
    },
    {
        "service": "payment-service",
        "endpoint": "/api/v1/payout",
        "http_status": 500,
        "error_type": "CurrencyConversionError",
        "stack_trace": "KeyError: 'EUR_USD' missing in FX rate cache at services/fx.py:53 in get_rate()",
        "root_cause": "FX rate cache loader missed default fallback pair when Redis cache expired.",
        "fix_description": "Added default ECB rate fallback provider and cache warm-up logic.",
        "pr_link": "https://github.com/company/payment-service/pull/204",
        "outcome": "solved"
    },
    {
        "service": "auth-service",
        "endpoint": "/oauth/token",
        "http_status": 401,
        "error_type": "JWTVerificationError",
        "stack_trace": "TokenExpiredError: jwt expired at node_modules/jsonwebtoken/verify.js:120 at auth/jwt.py:45",
        "root_cause": "Clock skew between auth-service and api-gateway caused valid tokens to be rejected.",
        "fix_description": "Added 60-second clock skew tolerance (leeway) to JWT verification options.",
        "pr_link": "https://github.com/company/auth-service/pull/77",
        "outcome": "solved"
    },
    {
        "service": "auth-service",
        "endpoint": "/api/v1/session/validate",
        "http_status": 500,
        "error_type": "RedisConnectionRefused",
        "stack_trace": "redis.exceptions.ConnectionError: Error 111 connecting to 10.0.4.12:6379. Connection refused at cache/redis.py:34",
        "root_cause": "Redis primary node failover caused session validator to attempt read from dead node IP.",
        "fix_description": "Updated Redis client configuration to use Sentinel cluster DNS instead of static IP.",
        "pr_link": "https://github.com/company/auth-service/pull/93",
        "outcome": "solved"
    },
    {
        "service": "auth-service",
        "endpoint": "/api/v1/user/mfa",
        "http_status": 503,
        "error_type": "TwilioSMSQuotaExceeded",
        "stack_trace": "TwilioRestException: [HTTP 429] Unable to create record: Exceeded SMS rate limit at providers/sms.py:67",
        "root_cause": "MFA request endpoint lacked IP rate-limiting, leading to bot abuse and SMS provider quota exhaustion.",
        "fix_description": "Implemented sliding-window rate limiting (max 3 MFA requests per phone number per 5 minutes).",
        "pr_link": "https://github.com/company/auth-service/pull/112",
        "outcome": "solved"
    },
    {
        "service": "user-service",
        "endpoint": "/api/v1/users",
        "http_status": 500,
        "error_type": "DuplicateKeyException",
        "stack_trace": "psycopg2.errors.UniqueViolation: duplicate key value violates unique constraint 'users_email_key' at db/users.py:89",
        "root_cause": "Race condition during simultaneous user sign-up requests without upsert lock.",
        "fix_description": "Added PostgreSQL ON CONFLICT DO UPDATE upsert logic and application-level mutex.",
        "pr_link": "https://github.com/company/user-service/pull/305",
        "outcome": "solved"
    },
    {
        "service": "user-service",
        "endpoint": "/api/v1/profile/avatar",
        "http_status": 413,
        "error_type": "MaxUploadSizeExceededError",
        "stack_trace": "FileTooLargeError: Image payload 18MB exceeds max 5MB at middleware/upload.py:28",
        "root_cause": "NGINX ingress controller body size limit was set to default 1MB while application allowed 5MB.",
        "fix_description": "Aligned NGINX ingress client_max_body_size setting with 5MB app threshold and added client-side image compression.",
        "pr_link": "https://github.com/company/user-service/pull/341",
        "outcome": "solved"
    },
    {
        "service": "user-service",
        "endpoint": "/api/v1/search",
        "http_status": 504,
        "error_type": "ElasticsearchQueryTimeout",
        "stack_trace": "elasticsearch.exceptions.ConnectionTimeout: ConnectionTimeout caused by ReadTimeoutError at search/es.py:102",
        "root_cause": "Unindexed wildcards in user search query triggered full cluster scan across 50M documents.",
        "fix_description": "Added N-gram edge tokenizer index mapping and enforced minimum 3-character search query prefix.",
        "pr_link": "https://github.com/company/user-service/pull/380",
        "outcome": "solved"
    }
]

def seed_database():
    print("Initializing database...")
    init_db()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if database already has historical entries
    cursor.execute("SELECT COUNT(*) as cnt FROM incidents")
    count = cursor.fetchone()["cnt"]
    
    if count > 0:
        print(f"Database already contains {count} incidents. Skipping seeding.")
        conn.close()
        return

    print("Seeding 9 historical resolved incidents...")
    for item in SEED_DATA:
        fp = create_fingerprint(
            service=item["service"],
            endpoint=item["endpoint"],
            error_type=item["error_type"],
            http_status=item["http_status"],
            stack_trace=item["stack_trace"]
        )
        fp_json = fingerprint_to_json(fp)
        
        cursor.execute("""
            INSERT INTO incidents (service, endpoint, http_status, error_type, stack_trace, fingerprint, root_cause, fix_description, pr_link, outcome)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            item["service"],
            item["endpoint"],
            item["http_status"],
            item["error_type"],
            item["stack_trace"],
            fp_json,
            item["root_cause"],
            item["fix_description"],
            item["pr_link"],
            item["outcome"]
        ))
    
    conn.commit()
    conn.close()
    print("Seeding successfully completed! 9 historical incidents stored.")

if __name__ == "__main__":
    seed_database()
