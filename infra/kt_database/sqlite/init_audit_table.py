# coding: utf-8
"""
Init the audit log table in SQLite DB
"""

import uuid
import hashlib
import sqlite3

AUDIT_TABLE = 'audit_logs'


if __name__ == '__main__':
    print('Init of dev database - step audit logs')
    connection = sqlite3.connect('inari.db')
    cursor = connection.cursor()
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
    cursor.execute(f'CREATE INDEX idx_provider_type ON {AUDIT_TABLE}(provider_type)')
    cursor.execute(f'CREATE INDEX idx_provider_protocol ON {AUDIT_TABLE}(provider_protocol)')

    connection.commit()

    print('Adding first audit logs')
    cursor.execute(f'SELECT id, login, created_at FROM users')
    users = cursor.fetchall()

    for user in users:
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
        connection.execute(f'''
            INSERT INTO {AUDIT_TABLE} 
                (timestamp, audit_id, user_id, user_login, trace_id, source_ip, 
                source_admin, category, action, result)
            VALUES 
                (:timestamp, :audit_id, :user_id, :user_login, :trace_id, :source_ip, 
                :source_admin, :category, :action, :result)
        ''', entry)
    connection.commit()

    print('Generate random activity')
    nb_events = 100

    connection.close()
    print('Init dev database - step audit logs: end')
