# coding: utf-8
"""
Module to handle API calls for stats
"""

import logging
import datetime

from typing import Annotated
from sqlmodel import Session, select, func
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.sql import text

from utils.database_utils import get_session, check_required_tables
from utils.check_utils import check_accept_json

from models.stats import (
    CurrentState,
    UserActivities,
    BaseIntData,
    BaseStrData,
    ActivitiesResults,
    ProvidersActivities,
    SerieInt,
    ChartData
)
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
        '/activity/users',
        dependencies=[Depends(check_accept_json)],
        response_model=UserActivities
)
def get_users_activity(session: Session_dep):
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


@_router.get(
        '/activity/providers',
        dependencies=[Depends(check_accept_json)],
        response_model=ProvidersActivities
)
def get_providers_activity(session: Session_dep):
    query = text("""
        WITH activity AS (
            SELECT 
                provider_id,
                COUNT(*) FILTER (WHERE result = 'success') AS success,
                COUNT(*) FILTER (WHERE result = 'fail') AS failure
            FROM audit_logs
            WHERE
                timestamp >= NOW() - INTERVAL '24 hours'
                AND user_id IS NOT NULL
            GROUP BY
                provider_id
        )
        SELECT
            p.name,
            p.type,
            COALESCE(a.success, 0) AS success,
            COALESCE(a.failure, 0) AS failure
        FROM providers p
        LEFT JOIN activity a ON p.id = a.provider_id
        ORDER BY (a.success + a.failure) DESC;
    """)
    result = session.exec(query).all()
    data = {
        'idp_success': [],
        'idp_failure': [],
        'idp_labels': [],
        'sp_success': [],
        'sp_failure': [],
        'sp_labels': [],
    }

    for row in result:
        p_type = row[1]
        data[f'{p_type}_success'].append(row[2])
        data[f'{p_type}_failure'].append(row[3])
        data[f'{p_type}_labels'].append(row[0])
    
    return ProvidersActivities(
        idp=ActivitiesResults(
            success=BaseIntData(data=data['idp_success']),
            failure=BaseIntData(data=data['idp_failure']),
            labels=BaseStrData(data=data['idp_labels'])
        ),
        sp=ActivitiesResults(
            success=BaseIntData(data=data['sp_success']),
            failure=BaseIntData(data=data['sp_failure']),
            labels=BaseStrData(data=data['sp_labels'])
        )
    )

@_router.get(
        '/activity/protocol',
        dependencies=[Depends(check_accept_json)],
        response_model=ChartData
)
def get_protocol_usage(session: Session_dep):
    query = text("""
        WITH protocols AS (SELECT DISTINCT protocol FROM providers),
        types AS (SELECT DISTINCT type FROM providers ),
        combined AS (
            SELECT
                t.type,
                p.protocol
            FROM
                types t
            CROSS JOIN protocols p
        ),
        users_per_providers AS (
            SELECT
                provider_type,
                provider_protocol,
                COUNT(DISTINCT(user_id)) AS users
            FROM audit_logs
            WHERE
                timestamp >= NOW() - INTERVAL '24 hours'
                AND result = 'success'
                AND provider_id IS NOT NULL
            GROUP BY
                provider_type,
                provider_protocol
        )
        SELECT
            c.type,
            c.protocol,
            COALESCE(u.users, 0) AS users
        FROM combined c
        LEFT JOIN users_per_providers u
            ON c.type = u.provider_type
            AND c.protocol = u.provider_protocol
        ORDER BY type, protocol;
    """)
    result = session.exec(query).all()
    data = {
        'idp_serie': [row[2] for row in result if row[0] == 'idp'],
        'sp_serie': [row[2] for row in result if row[0] == 'sp'],
    }
    idp_protocols = [row[1] for row in result if row[0] == 'idp']
    sp_protocols = [row[1] for row in result if row[0] == 'sp']

    if idp_protocols != sp_protocols:
        logger.error('Mismatch between IDP and SP protocols - %s %s',
                     idp_protocols, sp_protocols)
        raise HTTPException(500, detail="Protocols mismatch between idp and sp")
    
    return ChartData(
        series=[
            SerieInt(name='idp', data=data['idp_serie']),
            SerieInt(name='sp', data=data['sp_serie'])
        ],
        categories=idp_protocols
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