# coding: utf-8
"""
Managing the models used
"""

import datetime
from pydantic import BaseModel, EmailStr

class User(BaseModel):
    id: str
    login: str
    email: EmailStr | None = None
    firstname: str | None = None
    lastname: str | None = None
    created_at: datetime.datetime
