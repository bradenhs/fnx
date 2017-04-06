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
  const result = JSON.stringify(observable, (_, v) => v === undefined ? null : v)
  serializationCounter--
  return result
}

export function toJS(observable: object) {
  serializationCounter++
  Object.keys(observable).forEach(key => {
    observable[key]
  })
  serializationCounter--
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
