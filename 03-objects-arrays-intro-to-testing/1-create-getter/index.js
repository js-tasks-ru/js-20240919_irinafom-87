/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} fieldsString - the strings fieldsString separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(fieldsString) {

  return function(targetObject) {
    const fields = fieldsString.split('.');

    for (const field of fields) {
      if (typeof targetObject !== 'object' || !targetObject.hasOwnProperty(field)) {
        return undefined;
      }
      targetObject = targetObject[field];
    }
    return targetObject;
  };
}
