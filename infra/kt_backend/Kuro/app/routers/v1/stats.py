# coding: utf-8
"""
Module to handle API calls for stats
"""

import logging
import datetime

from typing import Annotated
from sqlmodel import Session, select, func
from fastapi import APIRouter, Depends

from utils.database_utils import get_session, check_required_tables
from utils.check_utils import check_accept_json

from models.stats import CurrentState
from models.user import UserInDB
from models.provider import Provider
from models.audit_log import AuditLog


logger = logging.getLogger('uvicorn.error')

_router = APIRouter(
    prefix='/api/v1/stats',
    tags=['Statistics']
)
Session_dep = Annotated[Session, Depends(get_session)]

@_router.get(
        '/current',
        dependencies=[Depends(check_accept_json)],
        response_model=CurrentState
)
def get_current_state(session: Session_dep):
    total_users = session.exec(select(func.count()).select_from(UserInDB)).one()
    total_idp = session.exec(
        select(func.count()).select_from(Provider).where(Provider.type == 'idp')
    ).one()
    total_sp = session.exec(
        select(func.count()).select_from(Provider).where(Provider.type == 'sp')
    ).one()

    delta = datetime.timedelta(days=3)
    time_limit = datetime.datetime.now(datetime.timezone.utc) - delta
    active_user_stmt = (
        select(func.count(func.distinct(AuditLog.user_id))).where(
            AuditLog.timestamp >= time_limit,
            AuditLog.action == 'access',
            AuditLog.result == 'success'
        )
    )
    active_users = session.exec(active_user_stmt).one()

    active_sessions_stmt = (
        select(func.count(func.distinct(AuditLog.trace_id))).where(
            AuditLog.timestamp >= time_limit,
            AuditLog.action == 'authentication',
            AuditLog.result == 'success'
        )
    )
    active_sessions = session.exec(active_sessions_stmt).one()

    return {
        'active_sessions': active_sessions,
        'active_users': active_users,
        'total_users': total_users,
        'total_idp': total_idp,
        'total_sp': total_sp
    }


# === Functions === #
def init_router():
    try:
        check_required_tables(['providers', 'users', 'audit_logs'])
    except RuntimeError as err:
        logger.critical('Failed to load module providers - %s', err)
        raise err

    logger.info('Module ready - stats (v1)')
    return _router