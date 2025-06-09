# coding: utf-8
"""
Init the providers table in SQLite DB
"""

import sys
import json
import logging
import psycopg2

TABLE = 'providers'
SECRET_FILE = '../../secrets.json'

logger = logging.getLogger(__name__)


def init() -> None:
    """
    Initiate providers table (SP & IDP) 
    """
    logger.info('Init default database - step providers')

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
                id SERIAL PRIMARY KEY,
                type TEXT NOT NULL,
                protocol TEXT NOT NULL,
                name TEXT NOT NULL
            )
        ''')

        cursor.execute('CREATE INDEX idx_type ON providers(type)')
        cursor.execute('CREATE INDEX idx_protocol ON providers(protocol)')
        cursor.execute('CREATE INDEX idx_name ON providers(name)')

        with open('./data/base_providers.json', 'r') as fp:
            data = json.load(fp)
            for provider in data:
                cursor.execute(f'''
                    INSERT INTO {TABLE} (type, protocol, name)
                    VALUES (%s, %s, %s)
                ''', (provider['type'], provider['protocol'], provider['name']))
                logger.info("Provider added - %s", provider['name'])

        conn.commit()
    except psycopg2.Error as err:
        logger.error('Failed to init providers data - %s', err)
    finally:
        if cursor:
            cursor.close()
        conn.close()
