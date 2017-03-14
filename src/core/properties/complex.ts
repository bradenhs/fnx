import * as core from '../../core'
import { ObjectKeyWeakMap } from '../../utils'

const complexValues = new ObjectKeyWeakMap<any, string>()

export const complexProperty: core.Property = {
  set(target, key, value, description: core.ComplexDescriptor<any, any>, root) {
    const proxy = complexProxy(target, key, value, value, description, root)
    complexValues.set(target, key, JSON.stringify(description.serialize(value)))
    return Reflect.set(target, key, proxy)
  },
  get(target, key) {
    return Reflect.get(target, key)
  }
}

function complexProxy(
  rootTarget: any, rootKey: any, rootValue: any, target: any,
  description: core.ComplexDescriptor<any, any>, root: any
) {
  if (typeof rootValue === 'string' ||
      typeof rootValue === 'number' ||
      typeof rootValue === 'boolean') {
    return rootValue
  }

  const dummyObject = {}
  return new Proxy(dummyObject, {
    apply(_, thisArg, argumentsList) {
      const returnValue = Reflect.apply(
        target, thisArg === dummyObject ? target : thisArg, argumentsList
      )
      enforceReadonly(rootTarget, rootKey, rootValue, description, root)
      return returnValue // complexProxy(rootTarget, rootKey, rootValue, returnValue, description, root)
    },
    construct(_, argumentsList, newTarget) {
      const returnValue = Reflect.construct(target, argumentsList, newTarget)
      enforceReadonly(rootTarget, rootKey, rootValue, description, root)
      return returnValue // complexProxy(rootTarget, rootKey, rootValue, returnValue, description, root)
    },
    defineProperty(_, key, attributes) {
      const returnValue = Reflect.defineProperty(target, key, attributes)
      enforceReadonly(rootTarget, rootKey, rootValue, description, root)
      return returnValue
    },
    deleteProperty(_, key) {
      const returnValue = delete target[key]
      enforceReadonly(rootTarget, rootKey, rootValue, description, root)
      return returnValue
    },
    get(_, key) {
      const returnValue = target[key]
      enforceReadonly(rootTarget, rootKey, rootValue, description, root)
      return returnValue // complexProxy(rootTarget, rootKey, rootValue, returnValue, description, root)
    },
    getOwnPropertyDescriptor(_, key) {
      const returnValue = Reflect.getOwnPropertyDescriptor(target, key)
      enforceReadonly(rootTarget, rootKey, rootValue, description, root)
      return returnValue
    },
    getPrototypeOf() {
      const returnValue = Reflect.getPrototypeOf(target)
      enforceReadonly(rootTarget, rootKey, rootValue, description, root)
      return returnValue // complexProxy(rootTarget, rootKey, rootValue, returnValue, description, root)
    },
    has(_, key) {
      const returnValue = Reflect.has(target, key)
      enforceReadonly(rootTarget, rootKey, rootValue, description, root)
      return returnValue
    },
    isExtensible() {
      const returnValue = Reflect.isExtensible(target)
      enforceReadonly(rootTarget, rootKey, rootValue, description, root)
      return returnValue
    },
    ownKeys() {
      const returnValue = Reflect.ownKeys(target)
      enforceReadonly(rootTarget, rootKey, rootValue, description, root)
      return returnValue // complexProxy(rootTarget, rootKey, rootValue, returnValue, description, root)
    },
    preventExtensions() {
      const returnValue = Reflect.preventExtensions(target)
      enforceReadonly(rootTarget, rootKey, rootValue, description, root)
      return returnValue
    },
    set(_, key, value, receiver) {
      const returnValue = Reflect.set(value, key, value, receiver)
      enforceReadonly(rootTarget, rootKey, rootValue, description, root)
      return returnValue
    },
    setPrototypeOf(_, proto) {
      const returnValue = Reflect.setPrototypeOf(target, proto)
      enforceReadonly(rootTarget, rootKey, rootValue, description, root)
      return returnValue
    }
  })
}

function enforceReadonly(
  rootTarget, rootKey, rootValue, description: core.ComplexDescriptor<any, any>, root
) {
  if ((!core.isActionInProgress(root) || description.readonly) &&
      didChange(rootTarget, rootKey, rootValue, description)) {
    throw new Error()
  }
}

function didChange(
  rootTarget, rootKey, rootValue, description: core.ComplexDescriptor<any, any>
) {
  const newSerializedValue = JSON.stringify(description.serialize(rootValue))
  if (complexValues.get(rootTarget, rootKey) !== newSerializedValue) {
    complexValues.set(rootTarget, rootKey, newSerializedValue)
    return true
  }
  return false
}
