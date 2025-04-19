# coding: utf-8
"""
Functions for validations and checks
"""
from fastapi import Request, HTTPException

def check_accept_json(request: Request):
    headers_accept = request.headers.get('accept', '')
    if 'application/json' not in headers_accept:
        raise HTTPException(status_code=406, detail="Client must accept 'application/json'")
