CREATE VIEW named_link AS
SELECT link.id, ent.name AS entity_name, prop.name AS property_name
FROM "link"
JOIN entity ent ON link.entity_id = ent.id
JOIN property prop ON link.property_id = prop.id ;