import sqlite3
import os
from pathlib import Path
from typing import List, Dict, Any, Optional

DB_PATH = Path(__file__).parent / "incidents.db"

def get_db_connection():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS incidents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            service TEXT NOT NULL,
            endpoint TEXT NOT NULL,
            http_status INTEGER NOT NULL,
            error_type TEXT NOT NULL,
            stack_trace TEXT NOT NULL,
            fingerprint TEXT NOT NULL,
            root_cause TEXT,
            fix_description TEXT,
            pr_link TEXT,
            outcome TEXT NOT NULL DEFAULT 'open',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    conn.commit()
    conn.close()

def dict_from_row(row: sqlite3.Row) -> Dict[str, Any]:
    if row is None:
        return None
    d = dict(row)
    return d
