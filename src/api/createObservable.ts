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
  return core.prepareObject(initialState, description)
}
