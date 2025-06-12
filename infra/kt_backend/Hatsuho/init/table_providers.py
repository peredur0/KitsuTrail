# coding: utf-8
"""
Init the providers table in SQLite DB
"""

import sys
import json
import logging
import sqlalchemy
import sqlalchemy.exc


logger = logging.getLogger(__name__)


def init(engine: sqlalchemy.Engine, table: str) -> None:
    """
    Initiate providers table (SP & IDP) 
    """
    logger.info('Init default database - step providers')

    with engine.begin() as conn:
        try:
            conn.execute(sqlalchemy.text(
                f'DROP TABLE IF EXISTS {table}'))
            conn.execute(sqlalchemy.text(f'''
                CREATE TABLE IF NOT EXISTS {table}(
                    id SERIAL PRIMARY KEY,
                    type TEXT NOT NULL,
                    protocol TEXT NOT NULL,
                    name TEXT NOT NULL
                )
            '''))

            conn.execute(sqlalchemy.text(
                f'CREATE INDEX idx_type ON {table}(type)'))
            conn.execute(sqlalchemy.text(
                f'CREATE INDEX idx_protocol ON {table}(protocol)'))
            conn.execute(sqlalchemy.text(
                f'CREATE INDEX idx_name ON {table}(name)'))

            with open('./data/base_providers.json', 'r') as fp:
                data = json.load(fp)
                for provider in data:
                    conn.execute(sqlalchemy.text(f'''
                        INSERT INTO {table} (type, protocol, name)
                        VALUES (:type, :protocol, :name)
                    ''', provider))
                    logger.info("Provider added - %s", provider['name'])

        except sqlalchemy.exc.SQLAlchemyError as err:
            logger.error('Failed to init providers data - %s', err)
            sys.exit(1)
