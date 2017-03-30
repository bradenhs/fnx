import * as core from '../core'

/**
 * Parses the given json string into the provided observable.
 * https://fnx.js.org/docs/api/parseInto.html
 * @param string The raw json string
 * @param observable The observable to set
 */
export function parseInto(input: string | object, observable: object) {
  if (typeof observable !== 'object' || !core.isObservable(observable)) {
    throw new Error('you must parse into an observable object')
  }

  let object
  if (typeof input === 'string') {
    try {
      object = JSON.parse(input)
    } catch(e) {
      throw new Error('The string you provided was not valid json')
    }

    if (typeof object !== 'object') {
      throw new Error('The string you provided was not a json object')
    }
  } else if (typeof input === 'object') {
    object = input
  } else {
    throw new Error('input should be a string or a plain json object')
  }

  core.parseInto(object, observable)
}
