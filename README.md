# eop (entities of properties)

A simple Dockerized CRUD app using [Postgres](https://www.postgresql.org/),  [Express](https://expressjs.com/), and [React](https://reactjs.org/) that manages entities, which have properties.
Migrations are handled in the API and use [db-migrate](https://github.com/db-migrate/node-db-migrate).

## Design decisions

1. Dockerized from the start

   To deliver business value the fastest, you should be in a deployable state from day one. This enables the agile practice of iterative development, and allows stakeholders earlier opportunities to give feedback, saving development time.

2. A single repo instead of 3. Why? 1 PR for everything instead of 1 PR for each of the following:

    - DB
    - API w/ self-contained migrations
    - UI

   This also makes deployments easier as some changes might be tightly coupled between, e.g., DB and API.

3. Migrations in the API (see [Pattern: Database per service](https://microservices.io/patterns/data/database-per-service.html))

   You need migrations. Don't create separate files that you need to run manually. Your application should be as easy to run and deploy as possible.

4. UI React components grouped by features (see [File Structure](https://reactjs.org/docs/faq-structure.html#grouping-by-features-or-routes))

   This makes it easier to focus on features that deliver business value vs getting lost in the technical details of how to implement business features.

5. API calls build into React UI components.

   The whole point of components is that they're reusable. There should be as few tightly coupled relationships between files as possible.

## Prerequisites

1. Install [docker](https://docs.docker.com/install/)
2. Install [docker-compose](https://docs.docker.com/compose/install/)

## Running the application

The following sections were tested in Ubuntu 18.10

### Startup

```bash
docker-compose build
docker-compose up
```

Open browser to [http://localhost:3000](http://localhost:3000)

### Teardown

Press `Ctrl+C` if in the same terminal instance running the app.
Then run the following:

```bash
docker-compose down
```

## Configuration

The following sections were tested using [Visual Studio Code](https://code.visualstudio.com/)

### Database

Credentials: see [docker-compose.yml](docker-compose.yml) and [api/config/database.json](api/config/database.json) (they should match)

Migrations: see [api/migrations/sqls](api/migrations/sqls) (new migrations: [create](https://db-migrate.readthedocs.io/en/latest/Getting%20Started/commands/#create))

### UI/API

Make sure the relevant environment vars in [docker-compose.yml](docker-compose.yml) and [ui/config/api.json](ui/config.api.json) match.

### Linting

Uses [ESLint](https://eslint.org/) (see [`.eslintrc.json`](.eslintrc.json))

1. Install [npm](https://www.npmjs.com/get-npm)
2. `npm install`

## Development

### Database Migrations

```bash
docker-compose up database
docker-compose run api run npm migrate
```

### UI only

```bash
docker-compose up database api
cd ui
npm start
```
