export function createState<T>(StateDescription: new() => T, initialState: T): T {
  return initialState;
}
