let serializationCounter = 0

export function isSerializing() {
  return serializationCounter > 0
}

export function incrementSerializationCounter() {
  serializationCounter++
}

export function decrementSerializationCounter() {
  serializationCounter--
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
