import * as core from '../core'

let snapshotAsJSONCounter = 0
let snapshotAsPlainObjectCounter = 0

export function isSnapshotingAsJSON() {
  return snapshotAsJSONCounter > 0
}

export function incrementSnapshotAsJSON() {
  snapshotAsJSONCounter++
}

export function decrementSnapshotAsJSON() {
  snapshotAsJSONCounter--
}

export function isSnapshotingAsPlainObject() {
  return snapshotAsPlainObjectCounter > 0
}

let applySnapshotFromJSON = false
let applySnapshotFromPlainObject = false

export function setIsApplyingSnapshotFromPlainObject(value: boolean) {
  applySnapshotFromPlainObject = value
}

export function isApplyingSnapshotFromJSON() {
  return applySnapshotFromJSON
}

export function isApplyingSnapshotFromPlainObject() {
  return applySnapshotFromPlainObject
}

export function getSnapshotAsString(observable: object) {
  snapshotAsJSONCounter++
  let str = ''
  if (observable instanceof Array) {
    str += '['
    str += observable.map(v => {
      if (typeof v === 'object') {
        if (core.isObservable(v)) {
          return v.getSnapshot({ asString: true })
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
          return `"${key}":${v.getSnapshot({ asString: true })}`
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
  snapshotAsJSONCounter--
  return str
}

// TODO what if complex type serialize from primitive to primitive?

export function getSnapshot(observable: object, options?: { asJSON: boolean }) {
  if (options && options.asJSON) {
    snapshotAsJSONCounter++
  } else {
    snapshotAsPlainObjectCounter++
  }
  let result
  if (observable instanceof Array) {
    result = []
  } else {
    result = {}
  }
  Object.keys(observable).forEach(key => {
    if (typeof observable[key] === 'object' && core.isObservable(observable[key])) {
      result[key] = observable[key].getSnapshot(options)
    } else {
      result[key] = observable[key]
    }
    // if (result[key] === undefined) {
    //   result[key] = null
    // }
  })
  if (options && options.asJSON) {
    snapshotAsJSONCounter--
  } else {
    snapshotAsPlainObjectCounter--
  }
  return Object.freeze(result)
}

export function applySnapshot(
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
    applySnapshotFromJSON = true
  } else {
    applySnapshotFromPlainObject = true
  }
  Object.keys(obj).forEach(k => {
    observable[k] = obj[k]
  })
  applySnapshotFromJSON = false
  applySnapshotFromPlainObject = false
}
