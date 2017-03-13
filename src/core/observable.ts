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
  const prepareMap = {
    [core.types.action]: core.prepareAction,
    [core.types.arrayOf]: core.prepareArrayOf,
    [core.types.boolean]: core.prepareBoolean,
    [core.types.complex]: core.prepareComplex,
    [core.types.computed]: core.prepareComputed,
    [core.types.mapOf]: core.prepareMapOf,
    [core.types.number]: core.prepareNumber,
    [core.types.object]: core.prepareObject,
    [core.types.oneOf]: core.prepareOneOf,
    [core.types.string]: core.prepareString,
  }
  const prepare: (...args: any[]) => any = prepareMap[description.type]
  if (prepare == undefined) {
    throw new Error(`Unrecognized property type: ${description.type.toString()}`)
  }
  return Reflect.set(target, key, prepare(value, description, root))
}
