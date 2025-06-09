# KitsuTrail Backend 

## Kuro
Kuro is the API server to interact with the database.
The core is using FastAPI and python

Once the server is running it's possible to access the swagger on [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### Install
```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
```

### Run in dev mode
```bash
source .venv/bin/activate
fastapi dev app/main.py
```

## Hatsuho
Hatsuho is the initialisation script.
Every time it is started it will delete and recreate all of the required table.
It will also add the data defined in the `data` folder.

**Default data**:
- `base_providers.json` contains all the IDP and SP to link to the platform
- `base_users.json` contains the default users on which the activity will be based

First, the users will be created at a random date and time between the `2025-03-01` and the  `2025-05-01`.
Then the providers will be created the day before the oldest user.
In this case no activities can be created before the providers creation.

The activities are generated users by users starting right after each users creation.
The activities generation stops when the datetime reached the real actual date/time (NOW).

The program is made to have more activities between 06h00 to 10h00 and 13h00 to 15h00 between Mondays and Fridays.
Any users start the activities with an authentication (IDP) should be working 3/4 of the time.
The number of application access (SP) is random between (1 and 4) and is successful 2/3 of the time.
The duration between two activities (with the same session) is between 1 seconds to 1 minute.
Random IP Address are generated for each session (IDP + SP within 5 minutes for 1 user)

Additionally, 3 unknown users are used to create some kind of 'monitoring' activities that are sometimes put in place by customer to check the platform availability.
The IP Address for these unknown users are fixed and will be always the same.


### Install
```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
```

### Run in dev mode
```bash
source .venv/bin/activate
python main.py
```
