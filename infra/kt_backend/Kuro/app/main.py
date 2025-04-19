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

modules = [
    {'name': 'users', 'path': 'routers.users'}
]

app = FastAPI()

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
