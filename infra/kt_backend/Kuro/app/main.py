# coding: utf-8
"""
KitsuTrail API main entrypoint
"""

import sqlalchemy
import sqlmodel

from typing import Annotated
from fastapi import FastAPI, Depends, Query

from .routers import users
from .models.users import Users

SQLITE_FILE = '../../kt_database/sqlite/inari.db'
SQLITE_URL = f'sqlite:///{SQLITE_FILE}'

ENGINE = sqlalchemy.create_engine(
    SQLITE_URL, 
    connect_args={
        'check_same_thread': False
    }
)

# --- can be external --- #
def get_session() -> sqlmodel.orm.session:
    with sqlmodel.Session(ENGINE) as session:
        yield session

# --- FastAPI app --- #

SessionDep = Annotated[sqlmodel.Session, Depends(get_session)]

app = FastAPI()
# app.include_router(users.router)

@app.get('/')
def get_root() -> dict:
    return {'message': 'what are you doing there'}

@app.get('/users/')
def read_users(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100
) -> list[Users]:
    users = session.exec(sqlmodel.select(Users).offset(offset).limit(limit)).all()
    return users
