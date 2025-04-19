# coding: utf-8
"""
Module to handle API calls for users
"""

from fastapi import APIRouter, Depends, Query
from typing import Annotated
from sqlmodel import Session, select

from ..utils.sqlite_utils import get_session
from ..utils.check_utils import check_accept_json
from ..models.users import Users

router = APIRouter(
    prefix='/users',
    tags=['users'],
    responses={404: {'description': 'Not found'}}
)

Session_dep = Annotated[Session, Depends(get_session)]

@router.get('/', dependencies=[Depends(check_accept_json)])
def get_users(
    session: Session_dep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100
) -> list[Users]:
    users = session.exec(select(Users).offset(offset).limit(limit)).all()
    return users
