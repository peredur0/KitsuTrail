# coding: utf-8
"""
Init the user table in SQLite DB
"""

import sys
import uuid
import json
import random
import logging
import psycopg2
import datetime

logger = logging.getLogger(__name__)

TABLE = 'users'
SECRET_FILE = '../../secrets.json'

def random_date():
    """
    Generate a random datetime
    """
    start = datetime.datetime(2025, 3, 1)
    end = datetime.datetime(2025, 5, 1)
    delta = end - start
    random_days = random.randint(0, delta.days)
    random_secs = random.randint(0, 86400)
    return start + datetime.timedelta(days=random_days, seconds=random_secs)


def init():
    logger.info("Init of dev database - step users")

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

    try:
        cursor = conn.cursor()
        cursor.execute(f'DROP TABLE IF EXISTS {TABLE}')
        cursor.execute(f'''
            CREATE TABLE IF NOT EXISTS {TABLE}(
                id CHAR(8) PRIMARY KEY CHECK (length(id) = 8),
                login TEXT NOT NULL UNIQUE,
                firstname TEXT,
                lastname TEXT,
                email TEXT,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        cursor.execute('CREATE UNIQUE INDEX idx_login ON users(login)')
        cursor.execute('CREATE INDEX idx_firstname ON users(firstname)')
        cursor.execute('CREATE INDEX idx_lastname ON users(lastname)')
        cursor.execute('CREATE INDEX idx_email ON users(email)')

        with open('./data/base_users.json', 'r') as file:
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
                    VALUES (%s, %s, %s, %s, %s, %s)
                ''', tmp_user)
                logger.info("User added - %s", user.get('login'))

        conn.commit()
    except psycopg2.Error as err:
        logger.error('Failed to init providers data - %s', err)
    finally:
        if cursor:
            cursor.close()
        conn.close()
