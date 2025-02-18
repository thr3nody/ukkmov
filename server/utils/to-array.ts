export function useToArray<T>(val: T | T[]): T[] {
  return Array.isArray(val) ? val : [val];
}
