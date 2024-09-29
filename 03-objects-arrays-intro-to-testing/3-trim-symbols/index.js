/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} sourceString - the initial string
 * @param {number} maxChars - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(sourceString, maxChars) {
  if (maxChars === undefined) {
    return sourceString;
  }
  let count = 0;
  let resultString = '';
  let size = 0;
  for (let i = 0; i < sourceString.length; i++) {
    count++;
    if (sourceString[i] !== sourceString[i + 1]) {
      size = Math.min(maxChars, count);
      resultString += sourceString[i].repeat(size);
      count = 0;
    }
  }
  return resultString;
}

export function trimSymbolsVariant(sourceString, maxChars) {
  if (maxChars === undefined) {
    return sourceString;
  }
  const charsArray = sourceString.split('').map((char, index, arr) => {
    if (char !== arr[index + 1]) {
      char += '.';
    }
    return char;
  });
  const partsArray = charsArray.join('').slice(0, -1).split('.');
  const resultArray = partsArray.map(part => part.length <= maxChars ? part : part.slice(0, maxChars));
  return resultArray.join('');
}
