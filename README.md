# KitsuTrail
This project simulates an IAM platform, and provide a dashboard using the generated data.

The really interesting part is in the Data management section:
- Audit Table
- Dashboard

## Installation
For the **frontend** (Tenko) 
- node v18.20.7 
- npm v10.8.2
- Angular 19.2.3
- typescript 5.7.3

Additional packages:
- @angular/material 19.2.17
- @angular/material-moment-adapter 19.2.17
- rxjs 7.8.2
- apexcharts 4.7.0
- ng-apexcharts 1.15.0

```
ng add @angular/material
npm install apexcharts ng-apexcharts -- save
```

For the API **backend** (Kuro)
- python 3.12.3
- datetime 5.5
- fastapi[standard] 0.115.12
- sqlalchemy 2.0.41
- pydantic 2.11.5
- sqlmodel 0.0.24
- psycopg2 2.9.10

For the init **backend** (Hatsuho)
- psycopg2 2.9.10

Create the virtual environment for backends
```bash
# In KitsuTrail/infra/kt_backend/{Hatsuho,Kuro}
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
```

For the **database** (Inari)
- postgres 16.9

```bash
# create a folder to add persistence to psql data
mkdir -p ./infra/kt_database/Inari/pgdata
```

Provide a password for inari in `template_init.sql` and rename it to `init.sql`.

Update the password in `template_secrets.json` and rename it to `secrets.json`

Update the postgresSQL password (admin password) in `.template_env` and rename it to `.env`.


## Usage
**Step 1**: Start the database (using docker compose)
```bash
# In KitsuTrail/infra
docker compose up
```

**Step 2**: Run the init script
```bash
# In KitsuTrail/infra/kt_backend/Hatsuho
source .venv/bin/activate && python main.py && deactivate
```

**Step 3**: Start the API server
```bash
# In KitsuTrail/infra/kt_backend/Kuro
source .venv/bin/activate && fastapi dev app/main.py
```

**Step 4**: Start the node.js server
```bash
# In KitsuTrail/infra/kt_frontend/Tenko
nvm use 18 && ng serve
```

- The main page should be accessible on [http://localhost:4200](http://localhost:4200).
- The Api swagger is accessible on [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)


## Documentation
- A logbooks and progress_summary in french are available in `KitsuTrail/docs` [FR]
- [Backend](./infra/kt_backend/README.md)
- [Frontend](./infra/kt_frontend/README.md)
- [Database](./infra/kt_database/README.md)

## Contributing
As this project is part of my course of study, any direct external contribution must be avoided. Thank you for your understanding.

However comments and remarks are very welcome.