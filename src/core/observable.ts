import * as core from '../core'

const OBSERVABLE_DESIGNATOR = Symbol('OBSERVABLE_DESIGNATOR')

/**
 * Test an object to see if it's an observable
 * @param object The object in question
 */
export function isObservable(object) {
  return object[OBSERVABLE_DESIGNATOR]
}

/**
 * Returns whether or not this key is the special OBSERVABLE_DESIGNATOR key
 * @param key The key that you are testing
 */
export function isObservableDesignatorKey(key) {
  return key === OBSERVABLE_DESIGNATOR
}

/**
 * Sets a property on an object
 * @param target The target you are setting the property on
 * @param key The key of the property you are setting
 * @param value The value you are setting
 * @param description A description of this property key
 * @param root The root of the state tree
 */
export function setProperty(
  target, key, value, description: core.Descriptor, root
) {
  const setMap = {
    [core.types.action]: core.actionProperty.set,
    [core.types.arrayOf]: core.arrayOfProperty.set,
    [core.types.boolean]: core.booleanProperty.set,
    [core.types.complex]: core.complexProperty.set,
    [core.types.computed]: core.computedProperty.set,
    [core.types.mapOf]: core.mapOfProperty.set,
    [core.types.number]: core.numberProperty.set,
    [core.types.object]: core.objectProperty.set,
    [core.types.oneOf]: core.oneOfProperty.set,
    [core.types.string]: core.stringProperty.set,
  }
  const set = setMap[description.type]
  if (set == undefined) {
    throw new Error(`Unrecognized property type: ${description.type.toString()}`)
  }
  return set(target, key, value, description, root)
}

/**
 * Get property
 */
export function getProperty(target, key, description: core.Descriptor, root, proxy) {
  const getMap = {
    [core.types.action]: core.actionProperty.get,
    [core.types.arrayOf]: core.arrayOfProperty.get,
    [core.types.boolean]: core.booleanProperty.get,
    [core.types.complex]: core.complexProperty.get,
    [core.types.computed]: core.computedProperty.get,
    [core.types.mapOf]: core.mapOfProperty.get,
    [core.types.number]: core.numberProperty.get,
    [core.types.object]: core.objectProperty.get,
    [core.types.oneOf]: core.oneOfProperty.get,
    [core.types.string]: core.stringProperty.get,
  }

  // If there is no description then this key doesn't exist on the
  // description - try to return it anyhow.
  if (description == undefined) {
    return Reflect.get(target, key)
  }

  const get = getMap[description.type]

  if (get == undefined) {
    throw new Error(`Unrecognized property type: ${description.type.toString()}`)
  }

  return get(target, key, description, root, proxy)
}
