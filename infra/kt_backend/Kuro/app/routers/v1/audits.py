# coding: utf-8
"""
Module to handle API calls for audit logs
"""

import logging

from typing import Annotated
from sqlmodel import Session, select
from fastapi import APIRouter, Depends, HTTPException

from utils.sqlite_utils import get_session, check_required_tables
from utils.check_utils import check_accept_json
from models.audit_log import AuditLog, AuditFilter

from sqlalchemy.dialects import postgresql

logger = logging.getLogger('uvicorn.error')

_router = APIRouter(
    prefix='/api/v1/audit',
    tags=['Audit']
)
Session_dep = Annotated[Session, Depends(get_session)]

FILTER_FIELDS = [
    'trace_id', 'action', 'result', 'user_id', 'user_login',
    'provider_id', 'provider_name', 'provider_type',
    'provider_protocol', 'category'
]


# --- Get entries
@_router.post(
    '/',
    dependencies=[Depends(check_accept_json)],
    response_model=list[AuditLog]
)
def get_entries(filter_body: AuditFilter, session: Session_dep):
    query = select(AuditLog)

    filter = filter_body.filter

    time_range = getattr(filter, 'time_range', None)
    if not time_range:
        raise HTTPException(status_code=400, detail='Missing time_range field')
    try:
        query = query.where(
            AuditLog.timestamp >= time_range.start,
            AuditLog.timestamp <= time_range.end
        )
    except AttributeError:
        raise HTTPException(status_code=400, detail='Missing start or end in time_range')

    for field in FILTER_FIELDS:
        values = getattr(filter, field, None)
        if values:
            query = query.where(getattr(AuditLog, field).in_(values))
    
    offset = (filter_body.page - 1) * filter_body.per_page
    query = query.offset(offset).limit(filter_body.per_page)
    query = query.order_by(AuditLog.timestamp.desc())

    compiled = query.compile(dialect=postgresql.dialect(),
                             compile_kwargs={"literal_binds": True})
    logger.debug(compiled)
    
    return session.exec(query).all()


# === Functions === #
def init_router():
    try:
        check_required_tables(['audit_logs'])
    except RuntimeError as err:
        logger.critical('Failed to load module audit_logs - %s', err)
        raise err

    logger.info('Module ready - audit logs (v1)')
    return _router