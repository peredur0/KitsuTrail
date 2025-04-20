# coding: utf-8
"""
Module to handle API calls for users
"""
import logging
import datetime

from typing import Annotated
from sqlmodel import Session, select
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.exc import IntegrityError

from utils.sqlite_utils import get_session, check_required_tables
from utils.check_utils import check_accept_json, generate_id
from models.user import UserInDB, UserPublic, UserCreate, UserUpdate

logger = logging.getLogger('uvicorn.error')

_router = APIRouter(
    prefix='/users',
    tags=['Users'],
    responses={404: {'description': 'Not found'}}
)
Session_dep = Annotated[Session, Depends(get_session)]

# --- Users list
@_router.get(
        '/', 
        dependencies=[Depends(check_accept_json)],
        response_model=list[UserPublic]
)
def list_users(
    session: Session_dep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100
):
    users = session.exec(select(UserInDB).offset(offset).limit(limit)).all()
    return users


# --- Add new user
@_router.post(
        '/',
        dependencies=[Depends(check_accept_json)],
        response_model=UserPublic
)
def create_user(user_data: UserCreate, session: Session_dep):
    try:
        new_id = generate_id(session)
    except RuntimeError as err:
        logger.error('Failed to create new user - %s', err)
        raise HTTPException(status_code=500, detail='Unable to generate UUID for new user')
    now = datetime.datetime.now(datetime.timezone.utc)
    new_user = UserInDB.from_create(user_data, id=new_id, create_at=now)

    try:
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
    except IntegrityError as err:
        session.rollback()
        raise HTTPException(status_code=409, detail="Login already taken")

    return new_user


# --- Get single user
@_router.get(
        '/{user_id}',
        dependencies=[Depends(check_accept_json)],
        response_model=UserPublic
)
def get_user(user_id: str, session: Session_dep):
    user = session.get(UserInDB, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return user


# --- Update user
@_router.patch(
        '/{user_id}',
        dependencies=[Depends(check_accept_json)],
        response_model=UserPublic
)
def update_user(user_id: str, user_data: UserUpdate, session: Session_dep):
    user_db = session.get(UserInDB, user_id)
    if not user_db:
        raise HTTPException(status_code=404, detail='User not found')
    
    user_new_data = user_data.model_dump(exclude_unset=True)
    user_db.sqlmodel_update(user_new_data)
    try:
        session.add(user_db)
        session.commit()
        session.refresh(user_db)
    except IntegrityError as err:
        session.rollback()
        raise HTTPException(status_code=409, detail="Cannot redefine field, login already taken")
    
    return user_db


# --- Delete existing user
@_router.delete(
        '/{user_id}',
        dependencies=[Depends(check_accept_json)]
)
def delete_user(user_id: str, session: Session_dep) -> dict:
    user = session.get(UserInDB, user_id)
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    
    session.delete(user)
    session.commit()
    return {'deleted': True}


# === Functions === #
def init_router():
    try:
        check_required_tables(['users'])
    except RuntimeError as err:
        logger.critical('Failed to load module users - %s', err)
        raise err
    
    logger.info('Module ready - users')
    return _router
