const OBSERVABLE_DESIGNATOR = Symbol('OBSERVABLE_DESIGNATOR');

/**
 * Returns if the object is an fnx observable.
 */
export function isAlreadyAnObservable<T extends object>(value: T) {
  return value[OBSERVABLE_DESIGNATOR] === true;
}

/**
 * Returns if the key is the special OBSERVABLE_DESIGNATOR key or not.
 */
export function isObservableDesignator(key: PropertyKey) {
  return key === OBSERVABLE_DESIGNATOR;
}

/**
 * Returns if the type 'number', 'boolean', 'string', or 'undefined'.
 */
export function isPrimitive(value: any) {
  return typeof value === 'number' || typeof value === 'boolean' ||
    typeof value === 'string' || typeof value === 'symbol' ||
    value == undefined;
}

/**
 * Returns whether or not the value is of type function.
 */
export function isFunction(value: any) {
  return typeof value === 'function';
}

/**
 * Returns whether or not the value is of type string.
 */
export function isString(value: any) {
  return typeof value === 'string';
}

/**
 * Returns whether or not the value is of type object.
 */
export function isObject(value: any) {
  return typeof value === 'object';
}

/**
 * Returns whether or not the value is of type symbol.
 */
export function isSymbol(value: any) {
  return typeof value === 'symbol';
}
