# coding: utf-8
"""
KitsuTrail API main entrypoint
"""

from fastapi import FastAPI

from .routers import users
from .models.users import Users


app = FastAPI()
app.include_router(users.router)

@app.get('/')
def get_root() -> dict:
    return {'message': 'what are you doing there'}
