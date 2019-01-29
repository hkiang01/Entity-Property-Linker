CREATE TABLE field (
    id  UUID DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    document_id UUID REFERENCES document(id),
    sample_value TEXT,
    PRIMARY KEY (id)
);