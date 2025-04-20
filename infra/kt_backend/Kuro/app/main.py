# coding: utf-8
"""
KitsuTrail API main entrypoint
"""
import os
import sys
import logging
import importlib

from fastapi import FastAPI

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

logger = logging.getLogger('uvicorn.error')

version = '0.0.1'
description = """
Kuro API server is managing the data related to the KitsuTrail project.

## Users
* **Read users list**
* **Create a new user**
* **Read a single user**
* **Update a single user**
* **Delete a single user**
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

modules = [
    {'name': 'users', 'path': 'routers.users'}
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
