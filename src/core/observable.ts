import * as core from '../core'

const OBSERVABLE_DESIGNATOR = Symbol('OBSERVABLE_DESIGNATOR')

export function isObservable(object) {
  return object[OBSERVABLE_DESIGNATOR]
}

export function isObservableDesignatorKey(key) {
  return key === OBSERVABLE_DESIGNATOR
}

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
  const prepare: (...args: any[]) => void = prepareMap[description.type]
  if (prepare == undefined) {
    throw new Error(`Unrecognized property type: ${description.type.toString()}`)
  }
  return Reflect.set(target, key, prepare(value, description, root))
}
