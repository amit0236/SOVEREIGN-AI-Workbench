import uuid
from datetime import datetime
from typing import List, Optional
from ..core.database import get_db_connection
from ..models.schemas import AuditEvent

class AuditService:
    @staticmethod
    def log_event(user: str, action: str, resource: str, model: str, status: str = "SUCCESS", details: str = "") -> AuditEvent:
        event_id = f"AUD-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        timestamp = datetime.now().strftime("%H:%M:%S")
        
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO audit_logs (id, timestamp, user, action, resource, model, status, details)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (event_id, timestamp, user, action, resource, model, status, details))
        conn.commit()
        conn.close()
        
        return AuditEvent(
            id=event_id,
            timestamp=timestamp,
            user=user,
            action=action,
            resource=resource,
            model=model,
            status=status,
            details=details
        )

    @staticmethod
    def get_events(action: Optional[str] = None, model: Optional[str] = None, status: Optional[str] = None) -> List[AuditEvent]:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = "SELECT id, timestamp, user, action, resource, model, status, details FROM audit_logs"
        params = []
        conditions = []
        
        if action and action != "ALL":
            conditions.append("action = ?")
            params.append(action)
        if model and model != "ALL":
            conditions.append("model = ?")
            params.append(model)
        if status and status != "ALL":
            conditions.append("status = ?")
            params.append(status)
            
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
            
        query += " ORDER BY rowid DESC LIMIT 100"
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        conn.close()
        
        return [
            AuditEvent(
                id=r["id"],
                timestamp=r["timestamp"],
                user=r["user"],
                action=r["action"],
                resource=r["resource"],
                model=r["model"],
                status=r["status"],
                details=r["details"]
            )
            for r in rows
        ]
