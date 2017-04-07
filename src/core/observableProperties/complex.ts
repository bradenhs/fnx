import * as core from '../../core'
import { ObjectKeyWeakMap } from '../../utils'

const complexValues = new ObjectKeyWeakMap<any, string>()

export const complexProperty: core.Property = {
  set(target, key, rawValue, description: core.ComplexDescriptor<any, any>, root) {
    let value = rawValue
    if (core.isDeserializingFromJSON()) {
      value = description.deserialize(rawValue)
    } else if (core.isDeserializingFromPlainObject()) {
      value = description.deserialize(description.serialize(rawValue))
    }

    const proxy = complexProxy(target, key, value, value, description, root)
    const newValue = JSON.stringify(description.serialize(value))
    const didChange = newValue !== complexValues.get(target, key)
    complexValues.set(target, key, newValue)
    return {
      didChange, result: Reflect.set(target, key, proxy),
    }
  },
  get(target, key, description: core.ComplexDescriptor<any, any>) {
    const storedValue = complexValues.get(target, key)
    if (storedValue == undefined) {
      return target[key] == undefined ? undefined : target[key]
    }
    if (core.isSerializingAsJSON()) {
      return JSON.parse(storedValue)
    } else if (core.isSerializingAsPlainObject()) {
      return description.deserialize(JSON.parse(storedValue))
    } else {
      return target[key]
    }
  }
}

function complexProxy(
  rootTarget: any, rootKey: any, rootValue: any, target: any,
  description: core.ComplexDescriptor<any, any>, root: any
) {
  if (target == undefined ||
      typeof target === 'string' ||
      typeof target === 'number' ||
      typeof target === 'boolean') {
    return target
  }

  let dummyObject: Object | Function
  if (typeof target === 'function') {
    dummyObject = function() {}
  } else {
    dummyObject = {}
  }
  return new Proxy(dummyObject, {
    apply(_0, _1, argumentsList) {
      const returnValue = target(...argumentsList)
      checkForMutation(rootTarget, rootKey, rootValue, description, root)
      if (typeof returnValue === 'function') {
        return complexProxy(
          rootTarget, rootKey, rootValue, returnValue.bind(target), description, root
        )
      } else {
        return complexProxy(rootTarget, rootKey, rootValue, returnValue, description, root)
      }
    },
    construct(): object {
      throw new Error(
        'Currently fnx does not support storing constructable objects in a complex type'
      )
      // const actualNewTarget = newTarget === dummyTarget ? target : newTarget
      // const returnValue = Reflect.construct(target, argumentsList, actualNewTarget)
      // checkForMutation(rootTarget, rootKey, rootValue, description, root)
      // return complexProxy(rootTarget, rootKey, rootValue, returnValue, description, root)
    },
    defineProperty(_, key, attributes) {
      const returnValue = Reflect.defineProperty(target, key, attributes)
      checkForMutation(rootTarget, rootKey, rootValue, description, root)
      return returnValue
    },
    deleteProperty(_, key) {
      const returnValue = delete target[key]
      checkForMutation(rootTarget, rootKey, rootValue, description, root)
      return returnValue
    },
    get(_, key) {
      const returnValue = target[key]
      checkForMutation(rootTarget, rootKey, rootValue, description, root)
      if (typeof returnValue === 'function') {
        return complexProxy(
          rootTarget, rootKey, rootValue, returnValue.bind(target), description, root
        )
      } else {
        return complexProxy(rootTarget, rootKey, rootValue, returnValue, description, root)
      }
    },
    getOwnPropertyDescriptor(_, key) {
      const returnValue = Reflect.getOwnPropertyDescriptor(target, key)
      checkForMutation(rootTarget, rootKey, rootValue, description, root)
      return returnValue
    },
    getPrototypeOf() {
      const returnValue = Reflect.getPrototypeOf(target)
      checkForMutation(rootTarget, rootKey, rootValue, description, root)
      return returnValue
    },
    has(_, key) {
      const returnValue = Reflect.has(target, key)
      checkForMutation(rootTarget, rootKey, rootValue, description, root)
      return returnValue
    },
    isExtensible() {
      const returnValue = Reflect.isExtensible(target)
      checkForMutation(rootTarget, rootKey, rootValue, description, root)
      return returnValue
    },
    ownKeys() {
      const returnValue = Reflect.ownKeys(target)
      checkForMutation(rootTarget, rootKey, rootValue, description, root)
      return returnValue
    },
    preventExtensions() {
      const returnValue = Reflect.preventExtensions(target)
      checkForMutation(rootTarget, rootKey, rootValue, description, root)
      return returnValue
    },
    set(_, key, value, receiver) {
      const returnValue = Reflect.set(value, key, value, receiver)
      checkForMutation(rootTarget, rootKey, rootValue, description, root)
      return returnValue
    },
    setPrototypeOf(_, proto) {
      const returnValue = Reflect.setPrototypeOf(target, proto)
      checkForMutation(rootTarget, rootKey, rootValue, description, root)
      return returnValue
    }
  })
}

function checkForMutation(
  rootTarget, rootKey, rootValue, description: core.ComplexDescriptor<any, any>, root
) {
  const newSerializedValue = JSON.stringify(description.serialize(rootValue))
  const changed = complexValues.get(rootTarget, rootKey) !== newSerializedValue
  if (changed) {
    if (!core.isActionInProgress(root)) {
      throw new Error('Attempted to mutate complex type of an action')
    }
    if (description.readonly) {
      throw new Error('Attemped to mutated readonly complex type')
    }
    complexValues.set(rootTarget,rootKey, newSerializedValue)
    core.markObservablesComputationsAsStale(rootTarget, rootKey)
    core.addObservablesReactionsToPendingReactions(rootTarget, rootKey)
  }
}
