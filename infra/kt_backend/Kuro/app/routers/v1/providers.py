# coding: utf-8
"""
Module to handle API calls for providers
"""

import logging

from typing import Annotated
from sqlmodel import Session, select
from fastapi import APIRouter, Depends

from utils.sqlite_utils import get_session, check_required_tables
from utils.check_utils import check_accept_json
from models.provider import Provider

logger = logging.getLogger('uvicorn.error')

_router = APIRouter(
    prefix='/api/v1/providers',
    tags=['Providers']
)
Session_dep = Annotated[Session, Depends(get_session)]

# --- Get IDP
@_router.get(
        '/idp',
        dependencies=[Depends(check_accept_json)],
        response_model=list[Provider]
)
def list_idp(session: Session_dep):
    return session.exec(select(Provider).where(Provider.type == 'idp')).all()

# --- Get SP
@_router.get(
        '/sp',
        dependencies=[Depends(check_accept_json)],
        response_model=list[Provider]
)
def list_sp(session: Session_dep):
    return session.exec(select(Provider).where(Provider.type == 'sp')).all()


# === Functions === #
def init_router():
    try:
        check_required_tables(['providers'])
    except RuntimeError as err:
        logger.critical('Failed to load module providers - %s', err)
        raise err

    logger.info('Module ready - providers (v1)')
    return _router
