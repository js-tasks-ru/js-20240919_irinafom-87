/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const locales = ['ru', 'en'];
  const options = { sensitivity: 'variant', caseFirst: 'upper' };
  const collator = new Intl.Collator(locales, options);
  const sortDesc = (a, b) => collator.compare(b, a);
  const sortAsc = (a, b) => collator.compare(a, b);
  const sortFunction = param === 'asc' ? sortAsc : sortDesc;
  return [...arr].sort(sortFunction);
}
