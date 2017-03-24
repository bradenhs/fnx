import * as core from '../core'

/**
 * Parses the given json string into the provided observable.
 * https://fnx.js.org/docs/api/parseInto.html
 * @param string The raw json string
 * @param observable The observable to set
 */
export function parseInto(string: string, observable: object) {
  if (typeof observable !== 'object' || !core.isObservable(observable)) {
    throw new Error('you must parse into an observable object')
  }

  if (typeof string !== 'string') {
    throw new Error('you must parse a string')
  }

  let object
  try {
    object = JSON.parse(string)
  } catch(e) {
    throw new Error('The string you provided was not valid json')
  }

  if (typeof object !== 'object') {
    throw new Error('The string you provided was not a json object')
  }

  core.parseInto(object, observable)
}
