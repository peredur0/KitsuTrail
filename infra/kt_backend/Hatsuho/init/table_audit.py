# coding: utf-8
"""
Init the audit log table in SQLite DB
"""
import sys
import uuid
import random
import logging
import datetime
import sqlalchemy
import sqlalchemy.exc

from sqlalchemy import text
from utils import activities


MIN_TO_MS = 60000

logger = logging.getLogger(__name__)


def init_table(engine: sqlalchemy.Engine, table: str) -> None:
    """
    Drop/create the table
    """
    with engine.begin() as conn:
        try:
            conn.execute(text(f'DROP TABLE IF EXISTS {table}'))
            conn.execute(text(f'''
                CREATE TABLE IF NOT EXISTS {table}(
                    timestamp TIMESTAMP NOT NULL,
                    audit_id TEXT PRIMARY KEY,
                    user_id TEXT,
                    user_login TEXT,
                    provider_type TEXT,
                    provider_id INTEGER,
                    provider_name TEXT,
                    provider_protocol TEXT,
                    trace_id TEXT NOT NULL,
                    source_ip TEXT,
                    source_admin TEXT,
                    category TEXT NOT NULL,
                    action TEXT NOT NULL,
                    result TEXT,
                    reason TEXT,
                    info TEXT
                )
            '''))
            conn.execute(text(f'CREATE UNIQUE INDEX idx_audit_id ON {table}(audit_id)'))
            conn.execute(text(f'CREATE INDEX idx_timestamp ON {table}(timestamp)'))
            conn.execute(text(f'CREATE INDEX idx_category ON {table}(category)'))
            conn.execute(text(f'CREATE INDEX idx_trace_id ON {table}(trace_id)'))
            conn.execute(text(f'CREATE INDEX idx_action ON {table}(action)'))
            conn.execute(text(f'CREATE INDEX idx_result ON {table}(result)'))
            conn.execute(text(f'CREATE INDEX idx_user_id ON {table}(user_id)'))
            conn.execute(text(f'CREATE INDEX idx_user_login ON {table}(user_login)'))
            conn.execute(text(f'CREATE INDEX idx_provider_id ON {table}(provider_id)'))
            conn.execute(text(f'CREATE INDEX idx_provider_name ON {table}(provider_name)'))
            conn.execute(text(f'CREATE INDEX idx_provider_type ON {table}(provider_type)'))
            conn.execute(text(f'CREATE INDEX idx_provider_protocol ON {table}(provider_protocol)'))
        except sqlalchemy.exc.SQLAlchemyError as err:
            logger.error('Failed to init audit logs table - %s', err)
            sys.exit(1)


def users_audit_logs(engine: sqlalchemy.Engine, table: str) -> list[dict]:
    """
    Create the user creation logs based on inplace creation dates
    """
    with engine.begin() as conn:
        result = conn.execute(text('SELECT id, login, created_at FROM users'))
        users = [dict(row._mapping) for row in result.fetchall()]

        for user in users:
            entry = {
                'timestamp': user['created_at'], 
                'audit_id': str(uuid.uuid4())[:8], 
                'user_id': user['id'],
                'user_login': user['login'],
                'trace_id': str(uuid.uuid4())[:8],
                'source_ip': '127.0.0.1',
                'source_admin': 'init-system',
                'category': 'management',
                'action': 'create_user',
                'result': 'success'
            }
            try:
                keys = list(entry.keys())
                conn.execute(text(f'''
                    INSERT INTO {table} ({','.join(keys)})
                    VALUES ({','.join([f':{key}' for key in keys])})
                '''), entry)

            except sqlalchemy.exc.IdentifierError:
                logger.error('Failed to log users creation - please retry')
                sys.exit(1)

    return users


def providers_audit_logs(engine: sqlalchemy.Engine, table: str) -> list[dict]:
    """
    Create provider creation before the first user creation
    """
    with engine.begin() as conn:
        result = conn.execute(text('SELECT MIN(created_at) FROM users'))

        start_time = result.fetchone()[0]
        start_time.replace(hour=0, minute=0, second=0)
        start_time = start_time - datetime.timedelta(days=1)
        
        result = conn.execute(text(f'SELECT id, type, protocol, name FROM providers'))
        providers = [dict(row._mapping) for row in result.fetchall()]

        for provider in providers:
            start_time = start_time + datetime.timedelta(minutes=30)
            entry = {
                'timestamp': start_time.isoformat(),
                'audit_id': str(uuid.uuid4())[:8], 
                'provider_type': provider['type'],
                'provider_id': provider['id'],
                'provider_name': provider['name'],
                'provider_protocol': provider['protocol'],
                'trace_id': str(uuid.uuid4())[:8],
                'source_ip': '127.0.0.1',
                'source_admin': 'init-system',
                'category': 'management',
                'action': 'create_provider',
                'result': 'success'
            }

            try:
                keys = list(entry.keys())
                conn.execute(text(f'''
                    INSERT INTO {table} ({','.join(keys)})
                    VALUES ({','.join([f':{key}' for key in keys])})
                '''), entry)

            except sqlalchemy.exc.IdentifierError:
                logger.error('Failed to log users creation - please retry')
                sys.exit(1)

    return providers


def activity_audit_logs(engine: sqlalchemy.Engine, table:str,
                        user: dict, providers_list: list[dict]) -> None:
    """
    Generate activities for a user
    """
    use_cases = [
        activities.auth_ok, activities.auth_ok, activities.auth_ok,
        activities.auth_nok,
        activities.access_nok
    ]
    start_ts = user['created_at']
    start_ts = start_ts + datetime.timedelta(minutes=1)
    
    while start_ts < datetime.datetime.now():
        use_case = random.choice(use_cases)
        data = use_case(start_ts, user, providers_list)
        
        keys = data['activities'][0].keys()
        try:
            with engine.begin() as conn:
                conn.execute(text(
                    f'''INSERT INTO {table} ({', '.join(keys)})
                        VALUES ({', '.join([f':{key}' for key in keys])})
                    '''),
                    data['activities']
                )
        except sqlalchemy.exc.IntegrityError:
            continue

        start_ts = data['end_ts']
        if (
            ((start_ts.hour > 6 and start_ts.hour < 10) or 
            (start_ts.hour > 13 and start_ts.hour < 15)) and
            (not start_ts.weekday() in (5, 6))
        ):
            delta = datetime.timedelta(
                milliseconds=random.randint(1*MIN_TO_MS, 5*MIN_TO_MS)
            )
        else:
            delta = datetime.timedelta(hours=random.randint(1,3))
        
        start_ts = start_ts + delta


def monitoring_activity(engine: sqlalchemy.Engine, table: str,
                        providers_list: list[dict]) -> None:
    """
    Generate activities like clients monitoring the platform
    """
    users = [
        ('monitoring', '145.5.187.3'),
    ]
    with engine.begin() as conn:
        result = conn.execute(text(
            'SELECT MIN(created_at) FROM users'))
        start_time = result.fetchone()[0]
        start_time.replace(hour=0, minute=0, second=0)

        sp_list = [provider for provider in providers_list if provider['type'] == 'sp']

        while start_time < datetime.datetime.now():
            for user in users:
                provider = random.choice(sp_list)
                event = {
                    'timestamp': start_time,
                    'audit_id': str(uuid.uuid4())[:8],
                    'user_login': user[0],
                    'provider_id': provider['id'],
                    'provider_type': provider['type'],
                    'provider_protocol': provider['protocol'],
                    'provider_name': provider['name'],
                    'trace_id': str(uuid.uuid4())[:8],
                    'source_ip': user[1],
                    'category': 'autorisation',
                    'action': 'access',
                    'result': 'fail',
                    'reason': 'unknown_user',
                    'info': 'Unknown in KT'
                }

                keys = list(event.keys())
                conn.execute(text(
                    f'''INSERT INTO {table} ({', '.join(keys)})
                        VALUES ({', '.join([f':{key}' for key in keys])})
                        ON CONFLICT (audit_id) DO NOTHING
                    '''), event)

            start_time = start_time + datetime.timedelta(minutes=5)            


def init(engine: sqlalchemy.Engine, table: str):
    """
    Initiate audit log table and add some activities
    """
    logger.info('Init of dev database - step audit logs')

    init_table(engine, table)

    logger.info('Adding first audit logs')
    users = users_audit_logs(engine, table)
    providers = providers_audit_logs(engine, table)

    logger.info('Generate random activity')
    for user in users:
        logger.info(f"Generating activities for {user['login']}")
        activity_audit_logs(engine, table, user, providers)
    logger.info('Users activity generation end')

    logger.info('Generate connection attempt with unknown user')
    monitoring_activity(engine, table, providers)

    logger.info('Init dev database - step audit logs: end')
