#coding: utf-8
"""
Utils functions for interacting with sqlite
"""

import sqlalchemy
import sqlmodel

from models.user import UserInDB

SQLITE_FILE = '../../kt_database/sqlite/inari.db'
SQLITE_URL = f'sqlite:///{SQLITE_FILE}'

ENGINE = sqlalchemy.create_engine(
    SQLITE_URL, 
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
