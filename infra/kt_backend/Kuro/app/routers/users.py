# coding: utf-8
"""
Module to handle API calls for users
"""
import os
from fastapi import APIRouter

router = APIRouter(
    prefix='/users',
    tags=['users'],
    responses={404: {'description': 'Not found'}}
)

@router.get('/')
async def get_users() -> list:
    return [{'id': 1, 'name': 'rick'}, {'id': 2, 'name': os.getcwd()}]
