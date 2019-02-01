# eop (entities of properties)

A simple Dockerized CRUD app using [Postgres](https://www.postgresql.org/),  [Express](https://expressjs.com/), and [React](https://reactjs.org/) that manages entities, which have properties.
Migrations are handled in a separate, dedicated service that uses [db-migrate](https://github.com/db-migrate/node-db-migrate).

## Design decisions

1 repo instead of 3. Why? 1 PR for everything instead of 1 PR for:

- DB/migrations
- API
- UI

It makes deployments a LOT easier.

## Prerequisites

1. Install [docker](https://docs.docker.com/install/)
2. Install [docker-compose](https://docs.docker.com/compose/install/)

## Running the application

The following sections were tested in Ubuntu 18.10

### Startup

```bash
sudo docker-compose build
sudo docker-compose up
```

Open browser to [http://localhost:3000](http://localhost:3000)

### Teardown

Press `Ctrl+C` if in the same terminal instance running the app.
Then run the following:

```bash
sudo docker-compose down
```

## Configuration

The following sections were tested using [Visual Studio Code](https://code.visualstudio.com/)

### Database

Credentials: see [docker-compose.yml](docker-compose.yml) and [migrate/config/database.json](migrate/config/database.json) (they should match)

Migrations: see [migrate/migrations/sqls](migrate/migrations/sqls) (new migrations: [create](https://db-migrate.readthedocs.io/en/latest/Getting%20Started/commands/#create))

### UI/API

Make sure the relevant environment vars in [docker-compose.yml](docker-compose.yml) and [ui/config/api.json](ui/config.api.json) match.

### Linting

Uses [ESLint](https://eslint.org/) (see [`.eslintrc.json`](.eslintrc.json))

1. Install [npm](https://www.npmjs.com/get-npm)
2. `npm install`