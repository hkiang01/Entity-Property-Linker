CREATE TABLE property (
    id              UUID DEFAULT uuid_generate_v4(),
    name            TEXT NOT NULL,
    PRIMARY KEY (id)
);