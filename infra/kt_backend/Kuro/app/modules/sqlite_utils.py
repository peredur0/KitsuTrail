# coding: utf-8
"""
Function to manage connection to sqlite DB
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

SQLITE_DB = '../../kt_database/sqlite/inari.db'