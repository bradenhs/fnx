import * as core from '../core'

export function parseInto(str: string, observable: object) {
  if (typeof observable !== 'object' || !core.isObservable(observable)) {
    throw new Error('you must parse into an observable object')
  }

  if (typeof str !== 'string') {
    throw new Error('you must parse a string')
  }

  let object
  try {
    object = JSON.parse(str)
  } catch(e) {
    throw new Error('The string you provided was not valid json')
  }

  if (typeof object !== 'object') {
    throw new Error('The string you provided was not a json object')
  }

  core.parseInto(object, observable)
}
