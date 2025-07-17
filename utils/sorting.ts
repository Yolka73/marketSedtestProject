export function isSortedAsc(arr: number[]): boolean {
  return arr.every((val, i, a) => i === 0 || a[i - 1] <= val);
}

export function isSortedDesc(arr: number[]): boolean {
  return arr.every((val, i, a) => i === 0 || a[i - 1] >= val);
}

export function isSortedByDateDesc(arr: Date[]): boolean {
  return arr.every((val, i, a) => i === 0 || a[i - 1] >= val);
} 

export function isSortedByDateAsc(arr: Date[]): boolean {
  return arr.every((val, i, a) => i === 0 || a[i - 1] <= val);
}
