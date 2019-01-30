CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE entity (
    id  UUID DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    parent_entity UUID REFERENCES entity(id),
    PRIMARY KEY (id)
);