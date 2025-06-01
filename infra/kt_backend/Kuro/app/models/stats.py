# coding: utf-8
"""
Managing the models used for stats
"""

from pydantic import BaseModel

class CurrentState(BaseModel):
    active_sessions: int = 0
    active_users: int = 0
    total_users: int = 0
    total_idp: int = 0
    total_sp: int = 0
