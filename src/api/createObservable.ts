import { parseDescription } from '../core'

export function createObservable<T>(StateDescription: new() =>  T, initialState: T): T {
  const description = parseDescription(StateDescription)

  console.log(description)

  return initialState || StateDescription as any as T
}
