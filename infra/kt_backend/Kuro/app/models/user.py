# coding: utf-8
"""
Managing the models used can be table schema or data model
"""

import datetime
from pydantic import EmailStr
from sqlmodel import SQLModel, Field

class UserBase(SQLModel):
    login: str = Field(unique=True, index=True)
    firstname: str | None = Field(default=None, index=True)
    lastname: str | None = Field(default=None, index=True)
    email: EmailStr | None = Field(default=None, index=True)

class UserCreate(UserBase):
    pass

class UserUpdate(SQLModel):
    login: str | None = None
    firstname: str | None = None
    lastname: str | None = None
    email: EmailStr | None = None


class UserInDB(UserBase, table=True):
    __tablename__ = "users"
    id: str = Field(primary_key=True)
    created_at: datetime.datetime = Field()

    def from_create(create_data: UserCreate, id: str, create_at: datetime.datetime):
        return UserInDB(**create_data.model_dump(), id=id, created_at=create_at)

class UserPublic(UserBase):
    id: str
    created_at: datetime.datetime

