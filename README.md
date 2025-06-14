# KitsuTrail
This project simulates an IAM platform, and provide a dashboard using the generated data.

The really interesting part is in the Data management section:
- Audit Table
- Dashboard

This project is fully using docker compose to run.

## Build (optional)
If you need to build images locally Dockerfiles are available:
- Frontend - [./infra/kt_frontend/Tenko/Dockerfile](./infra/kt_frontend/Tenko/Dockerfile)
- Backend - [./infra/kt_backend/Dockerfile](./infra/kt_backend/Dockerfile)

```bash
# In KitsuTrail/infra/kt_frontend/Tenko
docker build -t kitsutrail-app:X.X .

# In KitsuTrail/infra/kt_backend
docker build -t kitsutrail-base:X.X .
```

## Deploy
You can use/adapt the [compose.yaml](./infra/compose.yaml) to deploy the application on your environment.

The Kitsutrail docker images are available in my repo in docker hub: [https://hub.docker.com/repositories/peredur](https://hub.docker.com/repositories/peredur)

## Usage
```bash
# In KitsuTrail/infra
docker compose up -d
```
- The main page should be accessible on [http://localhost:8080](http://localhost:8080).
- The Api swagger is accessible on [http://localhost:8000/docs](http://localhost:8000/docs)

## Remove
You can clear the instance by using
```bash
# In KitsuTrail/infra
docker compose down -v --rmi all --remove-orphans 
```

## Documentation
- A logbooks and progress_summary in french are available in `KitsuTrail/docs` [FR]
- [Backend](./infra/kt_backend/README.md)
- [Frontend](./infra/kt_frontend/README.md)
- [Database](./infra/kt_database/README.md)

## Versions
For the **frontend** (Tenko) 
- node v18.20.7
- npm v10.8.2
- Angular 19.2.3
- typescript 5.7.3

In Dockerfile:
- node:18-alpine
- nginx-alpine

Additional packages:
- @angular/material 19.2.17
- @angular/material-moment-adapter 19.2.17
- rxjs 7.8.2
- apexcharts 4.7.0
- ng-apexcharts 1.15.0

For the API **backend** (Kuro & Tenko)
- python 3.12.3
- datetime 5.5
- fastapi[standard] 0.115.12
- sqlalchemy 2.0.41
- pydantic 2.11.5
- sqlmodel 0.0.24
- psycopg2 2.9.10

In Dockerfile
    - python:3.12-slim

## Contributing
As this project is part of my course of study, any direct external contribution must be avoided. Thank you for your understanding.

However comments and remarks are very welcome.