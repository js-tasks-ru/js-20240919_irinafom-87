/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (sourceObject, ...fields) => {
  const filteredSourceEntries = Object.entries(sourceObject).filter(([key, _]) => fields.includes(key));
  return Object.fromEntries(filteredSourceEntries);
};

export const pickFields = (sourceObject, ...fields) => {
  const resultObject = {};

  for (const field of fields) {
    if (sourceObject[field]) {
      resultObject[field] = sourceObject[field];
    }
  }
  return resultObject;
};
