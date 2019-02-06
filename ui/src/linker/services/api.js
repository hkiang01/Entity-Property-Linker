import { NamedLink } from "./models";

/**
 * The baseUrl for API requests
 */
import * as apiConfig from "../../../config/api.json";
const endpoint = apiConfig.dev.endpoint;

/**
 * Gets entities from the database
 */
export const getEntities = async () => {
  const response = await fetch(endpoint + "/entity");
  const body = await response.json();
  console.debug("getEntities response", response);
  if (response.status !== 200) throw Error(body.message);
  return body;
};

/**
 * Adds an entity to the database by name
 */
export const addEntity = async name => {
  const data = JSON.stringify({ name: name });
  const response = await fetch(endpoint + "/entity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: data
  });
  const body = await response.json();
  console.debug("addEntity response", response);
  if (response.status !== 200) throw Error(body.message);
  return body;
};

/**
 * Deletes entity from the database
 */
export const deleteEntity = async entity => {
  const data = JSON.stringify({ id: entity.id, name: entity.name });
  const response = await fetch(endpoint + "/entity", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: data
  });
  const body = await response.json();
  console.debug("deleteEntity response", response);
  if (response.status !== 200) throw Error(body.message);
  return body;
};

/**
 * Gets properties from the database
 */
export const getProperties = async () => {
  const response = await fetch(endpoint + "/property");
  const body = await response.json();
  console.debug("getProperties response", response);
  if (response.status !== 200) throw Error(body.message);
  return body;
};

/**
 * Adds a Property to the database
 */
export const addProperty = async name => {
  const data = JSON.stringify({ name: name });
  const response = await fetch(endpoint + "/property", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: data
  });
  const body = await response.json();
  console.debug("addProperty response", response);
  if (response.status !== 200) throw Error(body.message);
  return body;
};

/**
 * Deletes Properties from the database
 */
export const deleteProperty = async property => {
  const data = JSON.stringify({ id: property.id, name: property.name });
  const response = await fetch(endpoint + "/property", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: data
  });
  const body = await response.json();
  console.debug("deleteProperty response", response);
  if (response.status !== 200) throw Error(body.message);
  return body;
};

/**
 * Deletes link from the database
 */
export const deleteLink = async link => {
  console.debug("deleteLink link", link);
  const data = JSON.stringify({ id: link.id });
  const response = await fetch(endpoint + "/link", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: data
  });
  const body = await response.json();
  console.debug("deleteLink response", response);
  if (response.status !== 200) throw Error(body.message);
  return body;
};

/**
 * Adds aa link to the database by entityId and propertyId
 */
export const addLink = async (entityId, propertyId) => {
  const data = JSON.stringify({ entityId: entityId, propertyId: propertyId });
  const response = await fetch(endpoint + "/link", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: data
  });
  const body = await response.json();
  console.debug("addLink response", response);
  if (response.status !== 200) throw Error(body.message);
  return body;
};

/**
 * Gets named_link records from the database
 */
export const getNamedLinks = async () => {
  const response = await fetch(endpoint + "/named_link");
  const body = await response.json();
  console.debug("getLinks response", response);
  if (response.status !== 200) throw Error(body.message);

  const result = Promise.resolve(body);
  return result.then(function(records) {
    console.debug("getNamedLinks records", records);
    return records.map(
      record =>
        new NamedLink(
          record.id,
          record.entity_id,
          record.entity_name,
          record.property_id,
          record.property_name
        )
    );
  });
};
