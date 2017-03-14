import * as core from '../core'

/**
 * TODO
 * @param StateDescription TODO
 * @param initialState TODO
 */
export function createObservable<T>(
  StateDescription: new() =>  T, initialState: T
): T {
  const description = core.parseDescription(StateDescription)
  const object = { state: undefined }
  core.objectProperty.set(object, 'state', initialState, description)
  return object.state
}
