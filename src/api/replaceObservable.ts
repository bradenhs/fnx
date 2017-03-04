export function replaceObservable<T>(StateDescription: { new(): T }, initialState: T): T {
  return initialState || StateDescription as any as T
}
