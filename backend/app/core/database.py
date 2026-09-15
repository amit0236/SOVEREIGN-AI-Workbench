import sqlite3
import os
from pathlib import Path
from datetime import datetime

DB_PATH = Path(__file__).resolve().parent.parent.parent / "storage" / "sovereign.db"

def get_db_connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Audit log table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        user TEXT NOT NULL,
        action TEXT NOT NULL,
        resource TEXT NOT NULL,
        model TEXT NOT NULL,
        status TEXT NOT NULL,
        details TEXT
    )
    """)
    
    # Documents metadata
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_size_kb REAL NOT NULL,
        page_count INTEGER NOT NULL,
        upload_time TEXT NOT NULL,
        status TEXT NOT NULL,
        indexed INTEGER NOT NULL,
        is_scanned INTEGER NOT NULL,
        is_demo INTEGER NOT NULL,
        extraction_json TEXT
    )
    """)
    
    # Artifacts metadata
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS artifacts (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        file_name TEXT NOT NULL,
        format TEXT NOT NULL,
        category TEXT NOT NULL,
        file_size_kb REAL NOT NULL,
        generated_at TEXT NOT NULL,
        operator TEXT NOT NULL,
        status TEXT NOT NULL,
        file_path TEXT NOT NULL
    )
    """)
    
    # Pre-seed initial industrial audit logs if empty
    cursor.execute("SELECT COUNT(*) FROM audit_logs")
    if cursor.fetchone()[0] == 0:
        initial_events = [
            ("AUD-2026-001", "09:42:11", "operator", "DOCUMENT_UPLOAD", "pump_report.pdf", "SYSTEM", "SUCCESS", "Scanned PDF ingested to local storage"),
            ("AUD-2026-002", "09:42:15", "operator", "OCR_PROCESS", "pump_report.pdf", "local-vision", "SUCCESS", "Extracted vibration 7.2 mm/s, temp 84C"),
            ("AUD-2026-003", "09:42:17", "operator", "KNOWLEDGE_SEARCH", "Maintenance SOP", "local-general", "SUCCESS", "Matched MRPL-SOP-MNT-204 clause 4.2"),
            ("AUD-2026-004", "09:42:18", "operator", "CALCULATION", "pressure_check.py", "local-code", "SUCCESS", "Sandbox hydraulic power and threshold delta verified"),
            ("AUD-2026-005", "09:42:20", "operator", "ARTIFACT_CREATE", "inspection_note.docx", "local-general", "SUCCESS", "Generated DOCX observation note locally")
        ]
        cursor.executemany("""
        INSERT INTO audit_logs (id, timestamp, user, action, resource, model, status, details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, initial_events)

    conn.commit()
    conn.close()
