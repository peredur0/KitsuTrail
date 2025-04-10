# coding: utf-8
"""
Init the test database
"""
import uuid
import json
import random
import sqlite3
import datetime


USERS_TABLE = 'users'

def random_date():
    """
    Generate a random datetime
    """
    start = datetime.datetime(2020, 1, 1)
    end = datetime.datetime(2025, 4, 1)
    delta = end - start
    random_days = random.randint(0, delta.days)
    random_secs = random.randint(0, 86400)
    return start + datetime.timedelta(days=random_days, seconds=random_secs)


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

    with open('./dev_base_data.json', 'r') as file:
        data = json.load(file)
        for user in data:
            tmp_user = (
                str(uuid.uuid4())[:8],
                user.get('login'),
                user.get('firstname'),
                user.get('lastname'),
                user.get('email'),
                random_date().isoformat()
            )
            cursor.execute('''
                INSERT INTO users (id, login, firstname, lastname, email, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', tmp_user)
            print(f"User added - {user.get('login')}")

    connection.commit()
    connection.close()
    print('Init dev db end')
