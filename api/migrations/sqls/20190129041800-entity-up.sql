CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE entity (
    id      UUID DEFAULT uuid_generate_v4(),
    name    TEXT UNIQUE NOT NULL,
    PRIMARY KEY (id)
);