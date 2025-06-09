# coding: utf-8
"""
Entrypoint to initiate the tables and fill it wit data
"""

import logging

from init import table_providers, table_users, table_audit

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)

logger = logging.getLogger(__name__)

if __name__ == '__main__':
    logger.info('Start of Inari init')
    table_users.init()
    table_providers.init()
    table_audit.init()
