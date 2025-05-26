# coding: utf-8
"""
Init the providers table in SQLite DB
"""

import json
import sqlite3

PROVIDERS_TABLE = 'providers'


def init():
    print('Init of dev database - step providers')
    connection = sqlite3.connect('inari.db')
    cursor = connection.cursor()
    cursor.execute(f'DROP TABLE IF EXISTS {PROVIDERS_TABLE}')
    cursor.execute(f'''
        CREATE TABLE IF NOT EXISTS {PROVIDERS_TABLE}(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            protocol TEXT NOT NULL,
            name TEXT NOT NULL
        )
    ''')

    cursor.execute('CREATE INDEX idx_type ON providers(type)')
    cursor.execute('CREATE INDEX idx_protocol ON providers(protocol)')
    cursor.execute('CREATE INDEX idx_name ON providers(name)')

    with open('./src/init/dev_data/dev_base_providers.json', 'r') as file:
        data = json.load(file)
        for provider in data:
            cursor.execute(f'''
                INSERT INTO {PROVIDERS_TABLE} (type, protocol, name)
                VALUES (:type, :protocol, :name)
            ''', provider)
            print(f"Provider added - {provider['name']}")
    
    connection.commit()
    cursor.close()
    connection.close()
    print('Init dev database - step providers: end')
