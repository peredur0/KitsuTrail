# coding: utf-8
"""
Managing models for filters
"""

import datetime
from pydantic import BaseModel

class TimeRangeFilter(BaseModel):
    start: datetime.datetime
    end: datetime.datetime
