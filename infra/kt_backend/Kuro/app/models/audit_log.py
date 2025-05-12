# coding: utf-8
"""
Managing the model for audit log
"""

import datetime
from sqlmodel import SQLModel, Field

class AuditLog(SQLModel, table=True):
    __tablename__ = 'audit_logs'
    timestamp: datetime.datetime = Field(index=True)
    audit_id: str = Field(primary_key=True)
    user_id: str = Field(index=True)
    user_login: str = Field()
    provider_type: str = Field(index=True)
    provider_id: str = Field(index=True)
    provider_name: str = Field()
    provider_protocol: str = Field(index=True)
    trace_id: str = Field(index=True)
    source_ip: str = Field()
    source_admin: str = Field()
    category: str = Field(index=True)
    action: str = Field(index=True)
    result: str = Field(index=True)
    reason: str = Field()
    info: str = Field()
