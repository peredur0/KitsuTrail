# coding: utf-8
"""
Init the audit log table in SQLite DB
"""

import sys
import json
import uuid
import random
import logging
import datetime
import psycopg2


from utils import activities

TABLE = 'audit_logs'
MIN_TO_MS = 60000
SECRET_FILE = '../../secrets.json'

logger = logging.getLogger(__name__)


def init_table(conn: tuple) -> None:
    connection, cursor = conn
    """
    Drop/create the table
    """
    cursor.execute(f'DROP TABLE IF EXISTS {TABLE}')
    cursor.execute(f'''
        CREATE TABLE IF NOT EXISTS {TABLE}(
            timestamp TIMESTAMPTZ NOT NULL,
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
    ''')
    cursor.execute(f'CREATE UNIQUE INDEX idx_audit_id ON {TABLE}(audit_id)')
    cursor.execute(f'CREATE INDEX idx_timestamp ON {TABLE}(timestamp)')
    cursor.execute(f'CREATE INDEX idx_category ON {TABLE}(category)')
    cursor.execute(f'CREATE INDEX idx_trace_id ON {TABLE}(trace_id)')
    cursor.execute(f'CREATE INDEX idx_action ON {TABLE}(action)')
    cursor.execute(f'CREATE INDEX idx_result ON {TABLE}(result)')
    cursor.execute(f'CREATE INDEX idx_user_id ON {TABLE}(user_id)')
    cursor.execute(f'CREATE INDEX idx_user_login ON {TABLE}(user_login)')
    cursor.execute(f'CREATE INDEX idx_provider_id ON {TABLE}(provider_id)')
    cursor.execute(f'CREATE INDEX idx_provider_name ON {TABLE}(provider_name)')
    cursor.execute(f'CREATE INDEX idx_provider_type ON {TABLE}(provider_type)')
    cursor.execute(f'CREATE INDEX idx_provider_protocol ON {TABLE}(provider_protocol)')

    connection.commit()


def users_audit_logs(conn: tuple) -> None:
    """
    Create the user creation logs based on inplace creation dates
    """
    connection, cursor = conn
    cursor.execute(f'SELECT id, login, created_at FROM users')
    _users = cursor.fetchall()

    for user in _users:
        entry = {
            'timestamp': user[2], 
            'audit_id': str(uuid.uuid4())[:8], 
            'user_id': user[0],
            'user_login': user[1],
            'trace_id': str(uuid.uuid4())[:8],
            'source_ip': '127.0.0.1',
            'source_admin': 'init-system',
            'category': 'management',
            'action': 'create_user',
            'result': 'success'
        }
        try:
            cursor.execute(f'''
                INSERT INTO {TABLE} 
                    (timestamp, audit_id, user_id, user_login, trace_id, source_ip, 
                    source_admin, category, action, result)
                VALUES 
                    (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ''', (
                entry['timestamp'],
                entry['audit_id'],
                entry['user_id'],
                entry['user_login'],
                entry['trace_id'],
                entry['source_ip'],
                entry['source_admin'],
                entry['category'],
                entry['action'],
                entry['result']
            ))

        except psycopg2.IntegrityError:
            connection.rollback()
            continue

    connection.commit()
    return _users


def providers_audit_logs(conn: tuple) -> None:
    """
    Create provider creation before the first user creation
    """
    connection, cursor = conn
    cursor.execute(f'SELECT MIN(created_at) FROM users')

    start_time = cursor.fetchone()[0]
    start_time.replace(hour=0, minute=0, second=0)
    start_time = start_time - datetime.timedelta(days=1)
    
    cursor.execute(f'SELECT id, type, protocol, name FROM providers')
    _providers = cursor.fetchall()

    for provider in _providers:
        start_time = start_time + datetime.timedelta(minutes=30)
        entry = {
            'timestamp': start_time.isoformat(),
            'audit_id': str(uuid.uuid4())[:8], 
            'provider_type': provider[1],
            'provider_id': provider[0],
            'provider_name': provider[3],
            'provider_protocol': provider[2],
            'trace_id': str(uuid.uuid4())[:8],
            'source_ip': '127.0.0.1',
            'source_admin': 'init-system',
            'category': 'management',
            'action': 'create_provider',
            'result': 'success'
        }

        try:
            cursor.execute(f'''
                INSERT INTO {TABLE}
                    (timestamp, audit_id, provider_type, provider_id, provider_name,
                    provider_protocol, trace_id, source_ip, source_admin, category, action, result)
                VALUES
                    (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ''', (
                entry['timestamp'],
                entry['audit_id'],
                entry['provider_type'],
                entry['provider_id'],
                entry['provider_name'],
                entry['provider_protocol'],
                entry['trace_id'],
                entry['source_ip'],
                entry['source_admin'],
                entry['category'],
                entry['action'],
                entry['result']
            ))
        except psycopg2.IntegrityError:
            connection.rollback()
            continue

    connection.commit()
    return _providers


def activity_audit_logs(conn: tuple, user: tuple, providers_list: list[tuple]) -> None:
    """
    Generate activities for a user
    """
    connection, cursor = conn
    use_cases = [
        activities.auth_ok, activities.auth_ok, activities.auth_ok,
        activities.auth_nok,
        activities.access_nok
    ]
    start_ts = user[2]
    start_ts = start_ts + datetime.timedelta(minutes=1)
    
    while start_ts < datetime.datetime.now(datetime.timezone.utc):
        use_case = random.choice(use_cases)
        data = use_case(start_ts, user, providers_list)
        
        keys = data['activities'][0].keys()
        values = [
            tuple(activity[key] for key in keys)
            for activity in data['activities']
        ]
        try:
            cursor.executemany(
                f'''INSERT INTO {TABLE} ({', '.join(keys)})
                    VALUES ({', '.join(['%s'] * len(keys))})
                ''',
                values
            )
        except psycopg2.IntegrityError:
            connection.rollback()
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

    connection.commit() 


def monitoring_activity(conn: tuple, providers_list: list[tuple]) -> None:
    """
    Generate activities like clients monitoring the platform
    """
    connection, cursor = conn
    users = [
        ('monitoring', '145.5.187.3'),
        ('vpn_user', '52.62.72.83'), 
        ('test', '184.254.8.1')
    ]
    cursor.execute(f'SELECT MIN(created_at) FROM users')
    start_time = cursor.fetchone()[0]
    start_time.replace(hour=0, minute=0, second=0)

    sp_list = [provider for provider in providers_list if provider[1] == 'sp']

    while start_time < datetime.datetime.now(datetime.timezone.utc):
        for user in users:
            provider = random.choice(sp_list)
            event = {
                'timestamp': start_time,
                'audit_id': str(uuid.uuid4())[:8],
                'user_login': user[0],
                'provider_id': provider[0],
                'provider_type': provider[1],
                'provider_protocol': provider[2],
                'provider_name': provider[3],
                'trace_id': str(uuid.uuid4())[:8],
                'source_ip': user[1],
                'category': 'autorisation',
                'action': 'access',
                'result': 'fail',
                'reason': 'unknown_user',
                'info': 'Unknown in KT'
            }

            keys = list(event.keys())
            values = tuple(event[key] for key in keys)
            try:
                cursor.execute(
                    f'''INSERT INTO {TABLE} ({', '.join(keys)})
                        VALUES ({', '.join(['%s'] * len(keys))})
                    ''',
                    values
                )
            except psycopg2.IntegrityError:
                connection.rollback()
                continue
        
        start_time = start_time + datetime.timedelta(minutes=5)            

    connection.commit()


def init():
    logger.info('Init of dev database - step audit logs')

    with open(SECRET_FILE, 'r', encoding='utf-8') as fp:
        secrets = json.load(fp)['psql']
    
    try:
        conn = psycopg2.connect(
            dbname=secrets['database'],
            user=secrets['user'],
            password=secrets['password'],
            host=secrets['host'],
            port=secrets['port']
        )
    except psycopg2.Error as err:
        logger.error("Failed at connection - %s", err)
        sys.exit(1)

    cursor = conn.cursor()
    connect = (conn, cursor)
    init_table(connect)

    logger.info('Adding first audit logs')
    users = users_audit_logs(connect)
    providers = providers_audit_logs(connect)

    logger.info('Generate random activity')
    for user in users:
        logger.info(f'Generating activities for {user[1]}')
        activity_audit_logs(connect, user, providers)
    logger.info('Users activity generation end')

    logger.info('Generate connection attempt with unknown user')
    monitoring_activity(connect, providers)

    
    cursor.close()
    conn.close()
    logger.info('Init dev database - step audit logs: end')
