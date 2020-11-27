
export function ensureArray<T>(l: T | T[]) {
  if (Array.isArray(l)) { return l;}
  else { return [l]; }
}
