# coding: utf-8
"""
Managing the models used can be table schema or data model
"""

import datetime
from pydantic import EmailStr
from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(primary_key=True)
    login: str = Field(unique=True, index=True)
    firstname: str | None = Field(default=None, index=True)
    lastname: str | None = Field(default=None, index=True)
    email: EmailStr | None = Field(default=None, index=True)
    created_at: datetime.datetime = Field()
