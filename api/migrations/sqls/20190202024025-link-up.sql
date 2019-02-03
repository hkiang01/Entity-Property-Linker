CREATE TABLE link (
    id              UUID DEFAULT uuid_generate_v4(),
    entity_id       UUID REFERENCES entity(id)      NOT NULL,
    property_id     UUID REFERENCES property(id)    NOT NULL,
    PRIMARY KEY (id)
);