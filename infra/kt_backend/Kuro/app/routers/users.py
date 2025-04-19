# coding: utf-8
"""
Module to handle API calls for users
"""
import logging

from typing import Annotated
from sqlmodel import Session, select
from fastapi import APIRouter, Depends, Query, HTTPException

from utils.sqlite_utils import get_session, check_required_tables
from utils.check_utils import check_accept_json
from models.user import User

logger = logging.getLogger('uvicorn.error')

_router = APIRouter(
    prefix='/users',
    tags=['users'],
    responses={404: {'description': 'Not found'}}
)
Session_dep = Annotated[Session, Depends(get_session)]

# --- API endpoints --- #
@_router.get('/', dependencies=[Depends(check_accept_json)])
def get_users(
    session: Session_dep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100
) -> list[User]:
    users = session.exec(select(User).offset(offset).limit(limit)).all()
    return users

@_router.get('/{user_id}', dependencies=[Depends(check_accept_json)])
def get_user(
    user_id: str,
    session: Session_dep,
) -> User:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return user


# --- Functions --- #
def init_router():
    try:
        check_required_tables(['users'])
    except RuntimeError as err:
        logger.critical('Failed to load module users - %s', err)
        raise err
    
    logger.info('Module ready - users')
    return _router
