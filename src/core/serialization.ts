import * as core from '../core'

let serializeAsJSONCounter = 0
let serializeAsPlainObjectCounter = 0

export function isSerializingAsJSON() {
  return serializeAsJSONCounter > 0
}

export function isSerializingAsPlainObject() {
  return serializeAsPlainObjectCounter > 0
}

let deserializeFromJSON = false
let deserializeFromPlainObject = false

export function setIsDeserializingFromPlainObject(value: boolean) {
  deserializeFromPlainObject = value
}

export function isDeserializingFromJSON() {
  return deserializeFromJSON
}

export function isDeserializingFromPlainObject() {
  return deserializeFromPlainObject
}

export function toString(observable: object) {
  serializeAsJSONCounter++
  let str = ''
  if (observable instanceof Array) {
    str += '['
    str += observable.map(v => {
      if (typeof v === 'object') {
        if (core.isObservable(v)) {
          return v.toString()
        } else {
          return JSON.stringify(v)
        }
      } else if (typeof v === 'string') {
        return `"${v}"`
      } else if (v === undefined) {
        return 'null'
      } else {
        return v
      }
    }).join(',')
    str += ']'
  } else {
    str += '{'
    str += Object.keys(observable).map(key => {
      const v = observable[key]
      if (typeof v === 'object') {
        if (core.isObservable(v)) {
          return `"${key}":${v.toString()}`
        } else {
          return `"${key}":${JSON.stringify(v)}`
        }
      } else if (typeof v === 'string') {
        return `"${key}":"${v}"`
      } else if (v === undefined) {
        return `"${key}":null'`
      } else {
        return `"${key}":${v}`
      }
    }).join(',')
    str += '}'
  }
  serializeAsJSONCounter--
  return str
}

export function toJS(observable: object, options?: { serializeComplex: boolean }) {
  if (options && options.serializeComplex) {
    serializeAsJSONCounter++
  } else {
    serializeAsPlainObjectCounter++
  }
  let result
  if (observable instanceof Array) {
    result = []
  } else {
    result = {}
  }
  Object.keys(observable).forEach(key => {
    if (typeof observable[key] === 'object' && core.isObservable(observable[key])) {
      result[key] = observable[key].toJS(options)
    } else {
      result[key] = observable[key]
    }
    if (result[key] === undefined) {
      result[key] = null
    }
  })
  if (options && options.serializeComplex) {
    serializeAsJSONCounter--
  } else {
    serializeAsPlainObjectCounter--
  }
  return result
}

export function parseInto(
  json: object | string, observable: object, options?: { asJSON: boolean }
) {
  let obj
  if (typeof json === 'string') {
    if (options !== undefined) {
      throw new Error('options should not be defined if given value is string')
    }
    options = { asJSON: true }
    try {
      obj = JSON.parse(json)
    } catch(e) {
      throw new Error('The string you provided was not valid json')
    }

    if (typeof obj !== 'object') {
      throw new Error('The string you provided was not a json object')
    }
  } else if (typeof json === 'object') {
    obj = json
  } else {
    throw new Error('input should be a string or a plain json object')
  }
  if (options && options.asJSON) {
    deserializeFromJSON = true
  } else {
    deserializeFromPlainObject = true
  }
  Object.keys(obj).forEach(k => {
    observable[k] = obj[k]
  })
  deserializeFromJSON = false
  deserializeFromPlainObject = false
}

//
// toString
// toJSON
// toJS
//
// fromString
// fromJSON
// fromJS
//
