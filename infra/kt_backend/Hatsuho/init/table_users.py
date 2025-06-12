# coding: utf-8
"""
Init the user table in SQLite DB
"""

import sys
import uuid
import json
import random
import logging
import datetime
import sqlalchemy
import sqlalchemy.exc

logger = logging.getLogger(__name__)

def random_date() -> datetime.datetime:
    """
    Generate a random datetime
    """
    start = datetime.datetime(2025, 3, 1)
    end = datetime.datetime(2025, 5, 1)
    delta = end - start
    random_days = random.randint(0, delta.days)
    random_secs = random.randint(0, 86400)
    return start + datetime.timedelta(days=random_days, seconds=random_secs)


def init(engine: sqlalchemy.Engine, table: str) -> None:
    logger.info("Init of dev database - step users")

    with engine.begin() as conn:
        try:
            conn.execute(sqlalchemy.text(
                f'DROP TABLE IF EXISTS {table}'))
            conn.execute(sqlalchemy.text(
                f'''
                CREATE TABLE IF NOT EXISTS {table}(
                    id CHAR(8) PRIMARY KEY CHECK (length(id) = 8),
                    login TEXT NOT NULL UNIQUE,
                    firstname TEXT,
                    lastname TEXT,
                    email TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            '''))

            conn.execute(sqlalchemy.text(f'CREATE UNIQUE INDEX idx_login ON {table}(login)'))
            conn.execute(sqlalchemy.text(f'CREATE INDEX idx_firstname ON {table}(firstname)'))
            conn.execute(sqlalchemy.text(f'CREATE INDEX idx_lastname ON {table}(lastname)'))
            conn.execute(sqlalchemy.text(f'CREATE INDEX idx_email ON {table}(email)'))

            with open('./data/base_users.json', 'r') as file:
                data = json.load(file)
                for user in data:
                    tmp_user = {
                        'id': str(uuid.uuid4())[:8],
                        'login': user.get('login'),
                        'firstname': user.get('firstname'),
                        'lastname': user.get('lastname'),
                        'email': user.get('email'),
                        'created_at': random_date().isoformat()
                    }
                    conn.execute(sqlalchemy.text(f'''
                        INSERT INTO {table} (id, login, firstname, lastname, email, created_at)
                        VALUES (:id, :login, :firstname, :lastname, :email, :created_at)
                    '''), tmp_user)
                    logger.info("User added - %s", user.get('login'))

        except sqlalchemy.exc.SQLAlchemyError as err:
            logger.error('Failed to init users data - %s', err)
            sys.exit(1)
