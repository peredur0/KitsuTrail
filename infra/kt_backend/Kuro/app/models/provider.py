# coding: utf-8
"""
Managing the models used for providers
"""

from sqlmodel import SQLModel, Field

class Provider(SQLModel, table=True):
    __tablename__ = 'providers'
    id: int = Field(primary_key=True)
    type: str = Field(index=True)
    protocol: str = Field(index=True)
    name: str = Field(index=True)
