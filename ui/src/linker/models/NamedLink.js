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
