/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (sourceObject, ...fields) => {
  if (!Array.isArray(fields)) {
    return {};
  }
  const filteredSourceEntries = Object.entries(sourceObject).filter(([key, _]) => fields.includes(key));
  return Object.fromEntries(filteredSourceEntries);
};

export const pickFields = (sourceObject, ...fields) => {
  let resultObject = {};
  if (!Array.isArray(fields)) {
    return resultObject;
  }

  for (let field of fields) {
    if (sourceObject[field]) {
      resultObject[field] = sourceObject[field];
    }
  }
  return resultObject;
};
