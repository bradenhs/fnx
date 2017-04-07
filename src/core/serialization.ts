import * as core from '../core'

let serializationCounter = 0
let deserializationCounter = 0

export function isSerializing() {
  return serializationCounter > 0
}

export function isDeserializing() {
  return deserializationCounter > 0
}

export function toString(observable: object) {
  serializationCounter++
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
  serializationCounter--
  return str
}

export function toJSON(observable: object) {
  serializationCounter++
  let result
  if (observable instanceof Array) {
    result = []
  } else {
    result = {}
  }
  Object.keys(observable).forEach(key => {
    if (typeof observable[key] === 'object' && core.isObservable(observable[key])) {
      result[key] = observable[key].toJSON()
    } else {
      result[key] = observable[key]
    }
    if (result[key] === undefined) {
      result[key] = null
    }
  })
  serializationCounter--
  return result
}

export function parseInto(input: object | string, observable: object) {
  let obj
  if (typeof input === 'string') {
    try {
      obj = JSON.parse(input)
    } catch(e) {
      throw new Error('The string you provided was not valid json')
    }

    if (typeof obj !== 'object') {
      throw new Error('The string you provided was not a json object')
    }
  } else if (typeof input === 'object') {
    obj = input
  } else {
    throw new Error('input should be a string or a plain json object')
  }

  deserializationCounter++
  Object.keys(obj).forEach(k => {
    observable[k] = obj[k]
  })
  deserializationCounter--
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
