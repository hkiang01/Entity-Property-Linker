CREATE TABLE link (
    entity_id       UUID REFERENCES entity(id)          NOT NULL,
    property_id     UUID REFERENCES property(id)    NOT NULL,
    PRIMARY KEY (entity_id, property_id)
);