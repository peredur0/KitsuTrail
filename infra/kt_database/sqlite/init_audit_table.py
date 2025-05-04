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
            audit_id TEXT NOT NULL,
            timestamp DATETIME NOT NULL,
            categorie TEXT NOT NULL,
            trace_id TEXT NOT NULL,
            action TEXT NOT NULL,
            user_id TEXT,
            result TEXT,
            reason TEXT,
            details TEXT,
            provider_id INTEGER
        )
    ''')
    cursor.execute(f'CREATE UNIQUE INDEX idx_audit_id ON {AUDIT_TABLE}(audit_id)')
    cursor.execute(f'CREATE INDEX idx_timestamp ON {AUDIT_TABLE}(timestamp)')
    cursor.execute(f'CREATE INDEX idx_categorie ON {AUDIT_TABLE}(categorie)')
    cursor.execute(f'CREATE INDEX idx_trace_id ON {AUDIT_TABLE}(trace_id)')
    cursor.execute(f'CREATE INDEX idx_action ON {AUDIT_TABLE}(action)')
    cursor.execute(f'CREATE INDEX idx_result ON {AUDIT_TABLE}(result)')
    cursor.execute(f'CREATE INDEX idx_user_id ON {AUDIT_TABLE}(user_id)')
    cursor.execute(f'CREATE INDEX idx_provider_id ON {AUDIT_TABLE}(provider_id)')

    connection.commit()

    print('Adding first audit logs')
    cursor.execute(f'SELECT id, login, created_at FROM users')
    users = cursor.fetchall()

    for user in users:
        entry = (str(uuid.uuid4())[:8], user[2], 'management',
                 str(uuid.uuid4())[:8], 'create_user', user[0],
                 'success', f'{{"login": "{user[1]}"}}'
        )
        connection.execute(f'''
            INSERT INTO {AUDIT_TABLE} 
                (audit_id, timestamp, categorie, trace_id, 
                 action, user_id, result, details)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', entry)
    connection.commit()

    print('Generate random activity')
    nb_events = 100

    connection.close()
    print('Init dev database - step audit logs: end')
