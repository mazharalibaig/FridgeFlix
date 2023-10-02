export function distributeWordsToRows(words) {
  let rows = [];
  let remainingWords = [...words];
  while (remainingWords.length) {
    let rowCount = Math.ceil(remainingWords.length * 0.4);
    let row = remainingWords.splice(0, rowCount);
    rows.push(row);
  }
  return rows;
}
