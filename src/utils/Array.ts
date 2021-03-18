export function chunk<T>(array: T[], size: number) {
  const chunkedArray: T[][] = [];
  var index = 0;
  while (index < array.length) {
    chunkedArray.push(array.slice(index, size + index));
    index += size;
  }
  return chunkedArray;
}

export function orderByDescending<T extends Object>(array: T[], propName: keyof(T) & string ) : Array<T>{
  return array.sort((a,b) => +a[propName] - +b[propName])
}
