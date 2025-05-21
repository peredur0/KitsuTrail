# coding: utf-8
"""
Managing the model for audit log
"""

import datetime
from sqlmodel import SQLModel, Field
from pydantic import BaseModel

from models.filters import TimeRangeFilter

class AuditLog(SQLModel, table=True):
    __tablename__ = 'audit_logs'
    timestamp: datetime.datetime = Field(index=True)
    audit_id: str = Field(primary_key=True)
    user_id: str = Field(index=True)
    user_login: str = Field()
    provider_type: str = Field(index=True)
    provider_id: int = Field(index=True)
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


class QueryFilter(BaseModel):
    time_range: TimeRangeFilter
    trace_id: list[str] | None = None
    category: list[str] | None = None
    action: list[str] | None = None
    result: list[str] | None = None
    user_id: list[str] | None = None
    provider_id: list[int] | None = None
    provider_name: list[str] | None = None
    provider_type: list[str] | None = None
    provider_protocol: list[str] | None = None


class AuditFilter(BaseModel):
    filter: QueryFilter
    per_page: int | None = 50
    page: int | None = 1
