# coding: utf-8
"""
Functions for validations and checks
"""
import uuid

from fastapi import Request, HTTPException
from sqlmodel import Session
from utils.database_utils import is_uuid_available

def check_accept_json(request: Request):
    headers_accept = request.headers.get('accept', '')
    if 'application/json' not in headers_accept:
        raise HTTPException(status_code=406, detail="Client must accept 'application/json'")

def generate_id(session: Session) -> str:
    for _ in range(100):
        uuid_candidate = str(uuid.uuid4())[:8]
        if is_uuid_available(session, uuid_candidate):
            return uuid_candidate
    raise RuntimeError("Failed to generate available uuid after 100 attempts")
