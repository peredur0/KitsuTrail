# coding: utf-8
"""
Module to handle API calls for stats
"""

import logging
import datetime

from typing import Annotated
from sqlmodel import Session, select, func
from fastapi import APIRouter, Depends
from sqlalchemy.sql import text

from utils.database_utils import get_session, check_required_tables
from utils.check_utils import check_accept_json

from models.stats import CurrentState, UserActivities, BaseIntData, BaseStrData
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

    delta = datetime.timedelta(minutes=20)
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

    return CurrentState(
        active_sessions=active_sessions,
        active_users=active_users,
        total_users=total_users,
        total_idp=total_idp,
        total_sp=total_sp
    )


@_router.get(
        '/activity/users/hourly',
        dependencies=[Depends(check_accept_json)],
        response_model=UserActivities
)
def get_users_activity_hourly(session: Session_dep):
    query = text("""
        WITH hours AS (
            SELECT generate_series(
                date_trunc('hour', NOW() - INTERVAL '24 hours'),
                date_trunc('hour', NOW()),
                INTERVAL '1 hour'
            ) AS hour
        ),
        events AS (
            SELECT
                date_trunc('hour', timestamp) AS hour,
                COUNT(*) FILTER (WHERE action = 'authentication') AS authentications,
                COUNT(*) FILTER (WHERE action = 'access') AS access
                FROM audit_logs
            WHERE
                timestamp >= NOW() - INTERVAL '24 hours'
                AND user_id IS NOT NULL
            GROUP BY hour
        )
        SELECT
            TO_CHAR(h.hour, 'YYYY-MM-DD HH24:00') AS hours,
            COALESCE(e.authentications, 0) AS authentications,
            COALESCE(e.access, 0) AS access
        FROM hours h
        LEFT JOIN events e ON h.hour = e.hour
        ORDER BY h.hour;
    """)
    result = session.exec(query).all()
    data = {
        'labels': [],
        'authentications': [],
        'access': []
    }

    for row in result:
        data['labels'].append(row[0])
        data['authentications'].append(row[1])
        data['access'].append(row[2])
    
    return UserActivities(
        labels=BaseStrData(data=data['labels']),
        authentications=BaseIntData(data=data['authentications']),
        access=BaseIntData(data=data['access'])
    )


# === Functions === #
def init_router():
    try:
        check_required_tables(['providers', 'users', 'audit_logs'])
    except RuntimeError as err:
        logger.critical('Failed to load module providers - %s', err)
        raise err

    logger.info('Module ready - stats (v1)')
    return _router