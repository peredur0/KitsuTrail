# coding: utf-8
"""
Managing use cases for KT activities

The data used to generate the case has this format:
- providers: [(id, type, protocol, name), ...]
- user: (id, login, created_at)

Field for users activities:
- timestamp
- audit_id
- user_id
- user_login
- provider_id
- provider_type
- provider_name
- provider_protocol
- trace_id
- source_ip
- category
- action
- result
- reason
- info
"""


import uuid
import random
import datetime
import ipaddress


def auth_ok(start_ts: datetime.datetime, user: tuple, providers: list[tuple]) -> dict:
    """
    Generate application access log.
    The authentication is always successful.
    1 to many application access are created with the same trace_id.
    each audit log will have a different timestamp with a delta of 1 sec to 1 minutes with the previous line

    Success should be 2/3.

    Returns:
        dict:
            end_ts: last log timestamp
            activities: list of activities to send in db
    """
    reason_info = {
        'unknown_user': ['Unknown in SP'],
        'account_locked': ['Account locked in SP'],
        'permission_denied': ['role_missing', 'group_missing', 'attribut_mismatch']
    }

    activities = []
    trace_id = str(uuid.uuid4())[:8]
    user_ip = str(ipaddress.IPv4Address(random.getrandbits(32)))

    sp_list = [provider for provider in providers if provider[1] == 'sp']
    idp_list = [provider for provider in providers if provider[1] == 'idp']

    for event_nb in range(random.randint(2, 5)):
        if event_nb == 0:
            provider = random.choice(idp_list)
            action = 'authentication'
            result = 'success'
        else:
            provider = random.choice(sp_list)
            action = 'access'
            result = random.choice(['success', 'success', 'fail'])

        if result == 'fail':
            reason = random.choice(list(reason_info.keys()))
            info = random.choice(reason_info.get(reason))
        else:
            reason = None
            info = None

        event = {
            'timestamp': start_ts,
            'audit_id': str(uuid.uuid4())[:8],
            'user_id': user[0],
            'user_login': user[1],
            'provider_id': provider[0],
            'provider_type': provider[1],
            'provider_protocol': provider[2],
            'provider_name': provider[3],
            'trace_id': trace_id,
            'source_ip': user_ip,
            'category': 'autorisation',
            'action': action,
            'result': result,
            'reason': reason,
            'info': info
        }
        start_ts = start_ts + datetime.timedelta(milliseconds=random.randint(1000, 60000))
        activities.append(event)
    
    return {'end_ts': start_ts, 'activities': activities}


def auth_nok(start_ts: datetime.datetime, user: tuple, providers: list[tuple]) -> dict:
    """
    Generate logs where the authentication failed

    Returns:
        dict:
            end_ts: last log timestamp
            activities: list of activities to send in db
    """
    reason_info = {
        'unknown_user': ['Unknown in IDP'],
        'account_locked': ['Account locked in IDP'],
        'permission_denied': ['role_missing', 'group_missing', 'attribut_mismatch', 'wrong_credentials'],
        'timeout': ['No response from user']
    }

    activities = []
    trace_id = str(uuid.uuid4())[:8]
    user_ip = str(ipaddress.IPv4Address(random.getrandbits(32)))

    sp_list = [provider for provider in providers if provider[1] == 'sp']
    idp_list = [provider for provider in providers if provider[1] == 'idp']

    for event_nb in range(2):
        if event_nb == 0:
            provider = random.choice(idp_list)
            action = 'authentication'
        else:
            provider = random.choice(sp_list)
            action = 'access'

        reason = random.choice(list(reason_info.keys()))
        info = random.choice(reason_info.get(reason))

        event = {
            'timestamp': start_ts,
            'audit_id': str(uuid.uuid4())[:8],
            'user_id': user[0],
            'user_login': user[1],
            'provider_id': provider[0],
            'provider_type': provider[1],
            'provider_protocol': provider[2],
            'provider_name': provider[3],
            'trace_id': trace_id,
            'source_ip': user_ip,
            'category': 'autorisation',
            'action': action,
            'result': 'fail',
            'reason': reason,
            'info': info
        }
        start_ts = start_ts + datetime.timedelta(milliseconds=random.randint(1000, 60000))
        activities.append(event)
    
    return {'end_ts': start_ts, 'activities': activities}


def access_nok(start_ts: datetime.datetime, user: tuple, providers: list[tuple]) -> list:
    """
    Generate log when the user is blocked by KT

    Returns:
        list:
    """
    reason_info = {
        'account_locked': ['Account locked in KT'],
        'permission_denied': ['profile_missing'],
    }
    sp = random.choice([provider for provider in providers if provider[1] == 'sp'])
    reason = random.choice(list(reason_info.keys()))
    info = random.choice(reason_info.get(reason))

    event = {
        'timestamp': start_ts,
        'audit_id': str(uuid.uuid4())[:8],
        'user_id': user[0],
        'user_login': user[1],
        'provider_id': sp[0],
        'provider_type': sp[1],
        'provider_protocol': sp[2],
        'provider_name': sp[3],
        'trace_id': str(uuid.uuid4())[:8],
        'source_ip': str(ipaddress.IPv4Address(random.getrandbits(32))),
        'category': 'autorisation',
        'action': 'access',
        'result': 'fail',
        'reason': reason,
        'info': info
    }
    start_ts = start_ts + datetime.timedelta(minutes=1)
    return {'end_ts': start_ts, 'activities': [event]}
