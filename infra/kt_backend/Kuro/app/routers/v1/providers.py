# coding: utf-8
"""
Module to handle API calls for providers
"""

import logging

from fastapi import APIRouter

logger = logging.getLogger('uvicorn.error')

_router = APIRouter(
    prefix='/api/v1/providers',
    tags=['Providers']
)

# --- Get IDP
@_router.get('/idp')
def list_idp():
    return [
        {'id': 1, 'type': 'idp', 'protocol': 'SAML', 'name': 'Kitsu SSO'}
    ]

# --- Get SP
@_router.get('/sp')
def list_sp():
    return [
        {'id': 2, 'type': 'sp', 'protocol': 'SAML', 'name': 'Atlassia'}
    ]


# === Functions === #
def init_router():
    logger.info('Module ready - providers (v1)')
    return _router
