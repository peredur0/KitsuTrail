# KitsuTrail Databases
The database is holding in its table:
- users informations
- providers informations
- audit logs activities

## PostgreSQL
Here we are using psql in version 16.9.

The file `template_init.sql` contains the instruction to start the expected database from scratch
```sql
CREATE DATABASE inari;
CREATE USER inari WITH PASSWORD '<CHANGE_ME>';
ALTER DATABASE inari OWNER TO inari;
```

All of the table are created by the backend process **Hatsuho**.

In folder `stats` contains some sql queries used to generate stats.
They are not directly used in the API server, it's just more convenient to have them here.

If you are using docker a docker compose file is ready to use.


## SQLite table (Zenko)
This table was used during the initial development and can know be ignored
```
cd ./Zenko
python3 ./main.py
```
> should create a file named zenko.db
