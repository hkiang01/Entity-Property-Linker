# eop (entities of properties)


A simple Dockerized CRUD app using [Postgres](https://www.postgresql.org/), [Express](https://expressjs.com/), and [React](https://reactjs.org/) that manages entities, which have properties.
Migrations are handled in the API and use [db-migrate](https://github.com/db-migrate/node-db-migrate).

- [eop (entities of properties)](#eop-entities-of-properties)
  - [Design decisions](#design-decisions)
  - [Prerequisites](#prerequisites)
  - [Running the application](#running-the-application)
    - [Startup](#startup)
    - [Teardown](#teardown)
  - [Configuration](#configuration)
    - [Database](#database)
    - [UI/API](#uiapi)
  - [Development](#development)
    - [Linting/Auto-formatting](#lintingauto-formatting)
    - [Database Migrations](#database-migrations)
    - [UI only](#ui-only)
  - [Known Issues](#known-issues)

![alt text](screenshot.png "Screnshot")

## Design decisions

Priority number 1: enable the delivery business value

1. Dockerized from the start

   To deliver business value the fastest, you should be in a deployable state from day one. This enables the agile practice of iterative development, and allows stakeholders earlier opportunities to give feedback, saving development time. I'm assuming you know how to deploy Docker apps.

2. A single repo instead of 3. Why? 1 PR for everything instead of 1 PR for the API, and then another for the UI

   This also makes deployments easier as some changes might be tightly coupled between, the API and UI. THis enables you to deliver business value faster.

3. Migrations in the API (see [Pattern: Database per service](https://microservices.io/patterns/data/database-per-service.html))

   You need migrations. Don't create separate files that you need to run manually. Your application should be as easy to run and deploy as possible. Migrations make this easier. Migrations enable you to deliver business value faster.

4. UI React components grouped by features (see [File Structure](https://reactjs.org/docs/faq-structure.html#grouping-by-features-or-routes))

   This makes it easier to focus on features that deliver business value vs getting lost in the technical details of how to implement business features. This enables you to deliver business value faster.

   This design choice may incur code duplication, but managing components by component type does not enable to you deliver business value as quickly, e.g., in the case of 2 like concepts that are managed by a single component type all of a sudden diverging from each other. The UI/UX professionals that maintain popular component libraries have already figured out all of the reusable components necessary in a UI project. If you're writing a component library, organize components by component type. If you're writing a business application, organize components by feature.

5. API calls build into React UI components.

   The whole point of components is that they're reusable. There should be as few tightly coupled relationships between files as possible. You should be able to move around a given `.js` file containing a component at will. This enables agility and enables you to deliver business value faster.

6. JSON objects returned from API should mirror their corresponding DB schemas.

   This removes ambiguity in dealing with JSON objects that represent database objects, and respect the database schema as the single source of truth for their structure. The less ambiguity, the more certainty, and the more likely you're able to deliver business value quickly.

   Since the API calls are in the same file as everything else for a given component (see #5), it's easy to change this structure as needed, as you only need to modify a single file in the UI. The fewer files you need to change when the schema for a DB object changes, the more quickly you'll be able to deliver business value.

7. Most logs are at the debug level

   You don't want to crowd out the logs. There is value in delineating between debug, info, warn, etc. Log levels allow you to filter for the logs you care about quickly, enabling you to deliver business value faster.

8. Don't write more tests than necessary

   Writing tests take time. Only write tests that directly translate into one of the necessary capabilities of the product from a _business_ perspective, not a _technical_ perspective. This is also why you should organize your components according to features as opposed to component types.

   The way I like to think of what is necessary and what isn't is by asking myself: "Does this operation affect what's stored in the database?". The whole point of computing is, after all, to modify the state of your store. Most front-end applications are CRUD (Create, Read Update, Delete) applications. In other words, they're user-friendly interfaces to a database.

   For example: I'll write a test that ensures that you can link an `Entity` with a `Property`, as that's a necessary capability of the product, and translates to a change of state of the database. However, it's not necessary to write a test to make sure that a "Link" button changes color when pressed, as that is neither a business-critical function of the application, nor does it translate to a database change.

   Take this with a grain of salt (I'm not a professional QA Engineer).

9. Use the most popular component libraries that satisfy business requirements.

   Unless absolutely necessary (e.g., legal data privacy regulations), don't use custom libraries, as it will be more difficult for you to find support for issues you run into, and therefore making it more difficult for you to deliver business value.

   A rule of thumb: the more popular a software library is, the more support it has. The more support it has, the easier it is to find solutions to common problems that you'll run into when trying to develop a feature. These learned lessons are taken into account and implemented in the corresponding library to make it easier to use. Libraries that are easier to use will help you deliver business value faster.

10. Use auto-formatting

    Maintainable software enables the quick delivery of business value. Auto-linting takes the effort out of maintaining a readable codebase, making it easy to keep the code readable. Readable code is maintainable code. Maintainable code translates into enabling the delivery of business value quickly.

## Prerequisites

- [docker](https://docs.docker.com/install/)
- [docker-compose](https://docs.docker.com/compose/install/)
- [nvm](https://github.com/creationix/nvm)
  Load the version of node used in the project:
  ```bash
  nvm use
  ```

## Running the application

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

### Database

Credentials: see [docker-compose.yml](docker-compose.yml) and [api/config/database.json](api/config/database.json) (they should match)

### UI/API

Make sure the relevant environment vars in [docker-compose.yml](docker-compose.yml) and [ui/config/api.json](ui/config/api.json) match.

## Development

### Linting/Auto-formatting

Uses the following VS Code plugin:

Name: Prettier - Code formatter
Id: esbenp.prettier-vscode
Description: VS Code plugin for prettier/prettier
Version: 1.8.1
Publisher: Esben Petersen
VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

### Database Migrations

1.  Start database

    ```bash
    docker-compose up database
    ```

2.  Run migrations forward

    ```bash
    docker-compose run api run npm migrate
    ```

3.  Run migrations backwards

        ```bash
        docker-compose run api run npm rollback
        ```

    See [api/migrations/sqls](api/migrations/sqls) (new migrations: [create](https://db-migrate.readthedocs.io/en/latest/Getting%20Started/commands/#create))

### UI only

1. Install project-wide dev dependencies

   ```bash
   npm install --dev
   ```

2. Start database and api

   ```bash
   docker-compose up database api
   ```

3. In a separate terminal, start the UI

   ```bash
   cd ui
   npm start
   ```

4. Navigate to [http://localhost:3000](http://localhost:3000)

## Known Issues

- In [Links](ui/src/linker/Links.js), the table head has weird behavior when scrolling (see open issue: [https://github.com/mui-org/material-ui/issues/6625](https://github.com/mui-org/material-ui/issues/6625))
