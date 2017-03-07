import { parseDescription } from '../core'

/**
 * TODO
 * @param StateDescription TODO
 * @param initialState TODO
 */
export function createObservable<T>(StateDescription: new() =>  T, initialState: T): T {
  const description = parseDescription(StateDescription)

  Object.keys(description.properties.users.kind.properties).forEach(key => {
    console.log(key, description.properties.users.kind.properties[key])
  })

  return (initialState || StateDescription || description) as any as T
}
