#! coding: utf-8
"""
KitsuTrail backend entrypoint
"""

from typing import Union
from fastapi import FastAPI

from pydantic import BaseModel
from enum import Enum

app = FastAPI()

@app.get('/')
def read_root() -> dict:
    return {'Hello': 'there'}

class Item(BaseModel):
    name: str
    price: float
    is_offer: Union[bool, None] = None

@app.get('/items/{item_id}')
def read_item(item_id: int, q: Union[str, None] = None) -> dict:
    return {'item_id': item_id, "q": q}

@app.put('/items/{item_id}')
def update_item(item_id: int, item: Item) -> dict:
    return {'item_name': item.name, 'item_id': item_id}

@app.get('/users/me')
def read_user_me() -> dict:
    return {'user_id': "current_user"}

@app.get('/users/{user_id}')
def read_user(user_id) -> dict:
    return {'user_id': user_id}

class ModelName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "letnet"

@app.get('/models/{model_name}')
def get_model(model_name: ModelName):
    if model_name is ModelName.alexnet:
        return {'model_name': model_name, 'message': 'Deep learning'}

    if model_name.value == 'resnet':
        return {'model_name': model_name, 'message': 'LeCNN images'}
    
    return {'model_name': model_name, 'message': 'Residual'}

@app.get("/files/{file_path:path}")
def get_file(file_path: str) -> dict:
    return {'path': file_path}
