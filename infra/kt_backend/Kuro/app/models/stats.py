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

class BaseIntData(BaseModel):
    data: list[int] = []

class BaseStrData(BaseModel):
    data: list[str] = []

class UserActivities(BaseModel):
    authentications: BaseIntData
    access: BaseIntData
    labels: BaseStrData

class ActivitiesResults(BaseModel):
    success: BaseIntData
    failure: BaseIntData
    labels: BaseStrData

class ProvidersActivities(BaseModel):
    idp: ActivitiesResults
    sp: ActivitiesResults

class SerieInt(BaseModel):
    name: str
    data: list[int]

class ChartData(BaseModel):
    series: list[SerieInt]
    categories: list[str]

class UsersSummary(BaseModel):
    login: str
    authentication: int
    access: int
    failure: int
    events: int
