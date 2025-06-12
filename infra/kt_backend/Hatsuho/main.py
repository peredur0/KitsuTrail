# coding: utf-8
"""
Entrypoint to initiate the tables and fill it wit data
"""

import os
import logging
import sqlalchemy

from init import table_providers, table_users, table_audit

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)

logger = logging.getLogger(__name__)

if __name__ == '__main__':
    db_url = os.getenv('KITSUTRAIL__DATABASE__CONN')
    if not db_url:
        raise RuntimeError('Missing environment variable KITSUTRAIL__DATABASE_CONN ')

    engine = sqlalchemy.create_engine(db_url)
    logger.info('Start of Inari init')
    table_users.init(engine, 'users')
    table_providers.init(engine, 'providers')
    table_audit.init(engine, 'audit_logs')
