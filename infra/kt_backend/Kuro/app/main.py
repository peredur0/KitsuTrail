# coding: utf-8
"""
KitsuTrail API main entrypoint
"""
import os
import sys
import logging
import importlib

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

logger = logging.getLogger('uvicorn.error')

version = '0.1.0'
description = """
Kuro API server is managing the data related to the KitsuTrail project.

## Users
* **Read users list**
* **Create a new user**
* **Read a single user**
* **Update a single user**
* **Delete a single user**

## Providers
* **Read list of services providers**
* **Read list of identity providers**

## Audit
* **Read list of audit logs**

## Statistics
* **Get current state of the platform**
* **Get users activities (last 24h)**
* **Get providers success/fail activities (last 24h)**
"""

app = FastAPI(
    title='Kuro',
    description=description,
    summary='API server for the KitsuTrail project',
    version=version,
    contact={
        'name': 'Peredur',
        'url': 'https://github.com/peredur0/KitsuTrail',
        'email': 'martial.goehry@gmail.com'
    },
)

allow_origins = [
    'http://localhost:4200'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

modules = [
    {'name': 'users', 'path': 'routers.v1.users'},
    {'name': 'providers', 'path': 'routers.v1.providers'},
    {'name': 'audit', 'path': 'routers.v1.audits'},
    {'name': 'stats', 'path': 'routers.v1.stats'}
]

for module in modules:
    try:
        mod_import = importlib.import_module(module['path'])
        mod_router = mod_import.init_router()
        app.include_router(mod_router)
    except (AttributeError, ModuleNotFoundError) as err:
        logger.critical('Failed to load module %s - %s', module['name'], err)
        continue
    except RuntimeError:
        continue

@app.get('/')
def get_root() -> dict:
    return {'message': 'What are you doing here ?'}
