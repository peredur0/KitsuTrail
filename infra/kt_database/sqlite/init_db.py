# coding: utf-8
"""
Init the test database
"""
import uuid
import json
import sqlite3


USERS_TABLE = 'users'


def add_user(data: dict, cur: sqlite3.Cursor) -> None:
    """
    Add an user to the database
    """

if __name__ == '__main__':
    print("Init of dev database")
    connection = sqlite3.connect('inari.db')
    cursor = connection.cursor()
    cursor.execute(f'DROP TABLE IF EXISTS {USERS_TABLE}')
    cursor.execute(f'''
        CREATE TABLE IF NOT EXISTS {USERS_TABLE}(
            id TEXT PRIMARY KEY CHECK (length(id) = 8),
            login TEXT NOT NULL UNIQUE,
            firstname TEXT,
            lastname TEXT,
            email TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    cursor.execute('CREATE UNIQUE INDEX idx_login ON users(login)')
    cursor.execute('CREATE INDEX idx_firstname ON users(firstname)')
    cursor.execute('CREATE INDEX idx_lastname ON users(lastname)')
    cursor.execute('CREATE INDEX idx_email ON users(email)')



    connection.commit()
    connection.close()


