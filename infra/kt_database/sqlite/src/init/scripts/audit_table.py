# coding: utf-8
"""
Init the audit log table in SQLite DB
"""

import uuid
import random
import sqlite3
import datetime

from src.modules import activities

AUDIT_TABLE = 'audit_logs'
MIN_TO_MS = 60000

def init_table(conn) -> None:
    connection, cursor = conn
    """
    Drop/create the table
    """
    cursor.execute(f'DROP TABLE IF EXISTS {AUDIT_TABLE}')
    cursor.execute(f'''
        CREATE TABLE IF NOT EXISTS {AUDIT_TABLE}(
            timestamp DATETIME NOT NULL,
            audit_id TEXT NOT NULL,
            user_id TEXT,
            user_login TEXT,
            provider_type STRING,
            provider_id INTEGER,
            provider_name STRING,
            provider_protocol STRING,
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
    cursor.execute(f'CREATE UNIQUE INDEX idx_audit_id ON {AUDIT_TABLE}(audit_id)')
    cursor.execute(f'CREATE INDEX idx_timestamp ON {AUDIT_TABLE}(timestamp)')
    cursor.execute(f'CREATE INDEX idx_category ON {AUDIT_TABLE}(category)')
    cursor.execute(f'CREATE INDEX idx_trace_id ON {AUDIT_TABLE}(trace_id)')
    cursor.execute(f'CREATE INDEX idx_action ON {AUDIT_TABLE}(action)')
    cursor.execute(f'CREATE INDEX idx_result ON {AUDIT_TABLE}(result)')
    cursor.execute(f'CREATE INDEX idx_user_id ON {AUDIT_TABLE}(user_id)')
    cursor.execute(f'CREATE INDEX idx_provider_id ON {AUDIT_TABLE}(provider_id)')
    cursor.execute(f'CREATE INDEX idx_provider_name ON {AUDIT_TABLE}(provider_name)')
    cursor.execute(f'CREATE INDEX idx_provider_type ON {AUDIT_TABLE}(provider_type)')
    cursor.execute(f'CREATE INDEX idx_provider_protocol ON {AUDIT_TABLE}(provider_protocol)')

    connection.commit()


def users_audit_logs(conn) -> None:
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
        cursor.execute(f'''
            INSERT INTO {AUDIT_TABLE} 
                (timestamp, audit_id, user_id, user_login, trace_id, source_ip, 
                source_admin, category, action, result)
            VALUES 
                (:timestamp, :audit_id, :user_id, :user_login, :trace_id, :source_ip, 
                :source_admin, :category, :action, :result)
        ''', entry)
    connection.commit()
    return _users


def providers_audit_logs(conn: tuple) -> None:
    """
    Create provider creation before the first user creation
    """
    connection, cursor = conn
    cursor.execute(f'SELECT MIN(created_at) FROM users')
    start_time = datetime.datetime.fromisoformat(cursor.fetchone()[0])
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

        cursor.execute(f'''
            INSERT INTO {AUDIT_TABLE}
                (timestamp, audit_id, provider_type, provider_id, provider_name,
                provider_protocol, trace_id, source_ip, source_admin, category, action, result)
            VALUES
                (:timestamp, :audit_id, :provider_type, :provider_id, :provider_name, 
                :provider_protocol, :trace_id, :source_ip, :source_admin, :category, :action, :result)
        ''', entry)

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
    start_ts = datetime.datetime.fromisoformat(user[2])
    start_ts = start_ts + datetime.timedelta(minutes=1)
    
    while start_ts < datetime.datetime.now():
        use_case = random.choice(use_cases)
        data = use_case(start_ts, user, providers_list)
        
        keys = data['activities'][0].keys()
        try:
            cursor.executemany(
                f'''INSERT INTO {AUDIT_TABLE} ({', '.join(keys)})
                    VALUES ({', '.join([':'+key for key in keys])})
                ''',
                data['activities']
            )
        except sqlite3.IntegrityError:
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
    start_time = datetime.datetime.fromisoformat(cursor.fetchone()[0])
    start_time.replace(hour=0, minute=0, second=0)

    sp_list = [provider for provider in providers_list if provider[1] == 'sp']

    while start_time < datetime.datetime.now():
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

            keys = event.keys()
            try:
                cursor.execute(
                    f'''INSERT INTO {AUDIT_TABLE} ({', '.join(keys)})
                        VALUES ({', '.join([':'+key for key in keys])})
                    ''',
                    event
                )
            except sqlite3.IntegrityError:
                continue
        
        start_time = start_time + datetime.timedelta(minutes=5)            

    connection.commit()


def init():
    print('Init of dev database - step audit logs')
    connection = sqlite3.connect('inari.db')
    cursor = connection.cursor()
    conn = (connection, cursor)
    init_table(conn)

    print('Adding first audit logs')
    users = users_audit_logs(conn)
    providers = providers_audit_logs(conn)

    print('Generate random activity')
    for user in users:
        print(f'Generating activities for {user[1]}')
        activity_audit_logs(conn, user, providers)
    print('Users activity generation end')

    print('Generate connection attempt with unknown user')
    monitoring_activity(conn, providers)

    
    cursor.close()
    connection.close()
    print('Init dev database - step audit logs: end')
