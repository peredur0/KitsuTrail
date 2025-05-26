# coding: utf-8
"""
Entrypoint to init the databases and fill it with data
"""


from src.init.scripts import audit_table, users_table, providers_table


if __name__ == '__main__':
    users_table.init()
    providers_table.init()
    audit_table.init()
