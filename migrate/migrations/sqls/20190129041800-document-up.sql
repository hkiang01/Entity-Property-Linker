CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE document (
    id  UUID DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    parent UUID REFERENCES document(id),
    PRIMARY KEY (id)
);