/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} sourceString - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(sourceString, size) {
  if (size === undefined) {
    return sourceString;
  }
  const charsArray = sourceString.split('').map((char, index, arr) => {
    if (char !== arr[index + 1]) {
      char += '.';
    }
    return char;
  });
  const partsArray = charsArray.join('').slice(0, -1).split('.');
  const resultArray = partsArray.map(part => part.length <= size ? part : part.slice(0, size));
  return resultArray.join('');
}
