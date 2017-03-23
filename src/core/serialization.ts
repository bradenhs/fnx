let serializationCounter = 0
let deserializationCounter = 0

export function isSerializing() {
  return serializationCounter > 0
}

export function isDeserializing() {
  return deserializationCounter > 0
}

export function incrementSerializationCounter() {
  serializationCounter++
}

export function decrementSerializationCounter() {
  serializationCounter--
}

export function parseInto(obj: object, observable: object) {
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
