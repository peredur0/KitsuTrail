#coding: utf-8
"""
Utils functions for interacting with sqlite
"""

import sys
import json
import sqlmodel
import sqlalchemy

from models.user import UserInDB

MODE = 'psql'
if MODE == 'psql':
    with open('../../secrets.json', 'r', encoding='utf-8') as fp:
        secrets = json.load(fp)['psql']

    ENGINE = sqlalchemy.create_engine(
        f"postgresql+psycopg2://{secrets['user']}:{secrets['password']}@"
        f"{secrets['host']}:{secrets['port']}/{secrets['database']}",
        pool_pre_ping=True
    )
elif MODE == 'sqlite':
    DB_URL = 'sqlite:///../../kt_database/'
    ENGINE = sqlalchemy.create_engine(
        'sqlite:///../../kt_database/Zenko/zenko.db', 
        connect_args={
            'check_same_thread': False
        }
    )


def get_session() -> sqlmodel.orm.session:
    with sqlmodel.Session(ENGINE) as session:
        yield session


def check_required_tables(tables: list) -> None:
    present_tables = sqlalchemy.inspect(ENGINE).get_table_names()
    for table in tables:
        if table not in present_tables:
            raise RuntimeError(f"Missing required table '{table}'")


def is_uuid_available(session: sqlmodel.Session, uuid_candidate: str) -> bool:
    query = sqlmodel.select(UserInDB).where(UserInDB.id == uuid_candidate)
    return session.exec(query).first() is None
