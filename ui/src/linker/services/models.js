/**
 * An Property corresponding to the DB's `Property` table
 * This is available to be imported
 */
export class Property {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

/**
 * An Entity corresponding to the DB's `entity` table.
 * This schema is available to be imported
 */
export class Entity {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

/**
 * Mimics the link table
 */
export class Link {
  constructor(id, entityId, propertyId) {
    this.id = id;
    this.entityId = entityId;
    this.propertyId = propertyId;
  }
}

/**
 * Mimics the named_link table
 */
export class NamedLink {
  constructor(id, entityId, entityName, propertyId, propertyName) {
    this.id = id;
    this.entityId = entityId;
    this.entityName = entityName;
    this.propertyId = propertyId;
    this.propertyName = propertyName;
  }
}
