export function chunk<T>(array: T[], size: number) {
  const chunkedArray: T[][] = [];
  let index = 0;
  while (index < array.length) {
    chunkedArray.push(array.slice(index, size + index));
    index += size;
  }
  return chunkedArray;
}
