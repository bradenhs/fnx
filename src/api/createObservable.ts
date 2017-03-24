import * as core from '../core'

/**
 * Creates a new observable state tree out of the description and initial state provided
 * https://fnx.js.org/docs/api/createObservable.html
 * @param StateDescription The description of the state tree
 * @param initialState The initial state
 */
export function createObservable<T>(
  StateDescription: new() =>  T, initialState: T
): T {
  const description = core.parseDescription(StateDescription)
  const object = { state: undefined }
  core.objectProperty.set(object, 'state', initialState, description)
  return object.state
}
