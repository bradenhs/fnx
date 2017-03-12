import {
  ActionDescriptor,
  ArrayOfDescriptor,
  BooleanDescriptor,
  ComplexDescriptor,
  ComputedDescriptor,
  MapOfDescriptor,
  NumberDescriptor,
  ObjectDescriptor,
  OneOfDescriptor,
  ParsedObjectDescriptor,
  StringDescriptor,
  types,
} from '../core'

// Create a map of identifiers and their corresponding parsers
const identifierParserMap = {
  [types.action]: parseActionDescriptor,
  [types.arrayOf]: parseArrayOfDescriptor,
  [types.boolean]: parsePrimitiveDescriptor,
  [types.complex]: parseComplexDescriptor,
  [types.computed]: parseComputedDescriptor,
  [types.mapOf]: parseMapOfDescriptor,
  [types.number]: parsePrimitiveDescriptor,
  [types.object]: parseObjectDescriptor,
  [types.oneOf]: parseOneOfDescriptor,
  [types.string]: parsePrimitiveDescriptor,
}

// Keeps a cache of parsed classes so we don't have to keep parsing them
const parsedObjectCache = new WeakMap<new () => any, ParsedObjectDescriptor<any>>()

/**
 * Parses and validates the provided description into a usable format
 * @param Description The description of the observable
 */
export function parseDescription(Description: new() => any) {
  return parseObjectDescriptor({
    type: types.object,
    readonly: true, optional: false,
    clazz: Description,
  })
}

/**
 * Parses and validates the provided object descriptor
 * @param descriptor The object descriptor
 */
function parseObjectDescriptor<T>(descriptor: ObjectDescriptor<T>) {
  // Ensure it's type is a class
  if (typeof descriptor.clazz !== 'function') {
    throw new Error()
  }

  // Initialize arrays for keeping track of properties that need to be marked
  // as readonly or optional
  let readonlyProperties = []
  let optionalProperties = []

  // Ready a reassignable prototype variable
  let prototype = descriptor.clazz.prototype

  if (prototype == undefined) {
    throw new Error()
  }

  // Walk up the prototype chain
  do {
    // 'constructor' should be the only property name defined
    if (Object.getOwnPropertyNames(prototype).length !== 1) {
      throw new Error()
    }

    // Get the symbols
    const symbols = Object.getOwnPropertySymbols(prototype)

    // If it has the readonly symbol add it's contents to the readonly array
    if (prototype[types.readonly] != undefined) {
      readonlyProperties = [
        ...readonlyProperties,
        ...Object.keys(prototype[types.readonly])
      ]
      // Remove this from the symbol list
      symbols.splice(symbols.indexOf(types.readonly), 1)
    }

    // If it has the optional symbol add it's contents to the optional array
    if (prototype[types.optional] != undefined) {
      optionalProperties = [
        ...optionalProperties,
        ...Object.keys(prototype[types.optional])
      ]
      // Remove this from the symbol list
      symbols.splice(symbols.indexOf(types.optional), 1)
    }

    // If any symbols are left they're extraneous so throw an error
    if (symbols.length > 0) {
      throw new Error()
    }

    // Get the parent prototype and keep walking up the chain until we reach
    // Object.prototype
    prototype = Object.getPrototypeOf(prototype)
  } while (prototype !== Object.prototype)

  // Create a new instance of descriptor.type
  const instance = new descriptor.clazz()

  // Mark readonly properties
  readonlyProperties.forEach(key => {
    instance[key] = { ...instance[key], ...{ readonly: true } }
  })

  // Mark optional properties
  optionalProperties.forEach(key => {
    instance[key] = { ...instance[key], ...{ optional: true } }
  })

  // Initialize ParsedObjectTypeDescriptor to build and then return it as the description
  const description: ParsedObjectDescriptor<any> = {
    readonly: descriptor.readonly, optional: descriptor.optional,
    properties: { }, type: descriptor.type,
  }

  Object.keys(instance).forEach(key => {
    // Ensure all properties are objects
    if (typeof instance[key] !== 'object') {
      throw new Error()
    }

    // If this is an object descriptor run this instead
    if (instance[key].identifier === types.object) {
      // TODO parse objects lazily to allow for cicular references

      // If we haven't stored this in our map of existing parsed object descriptors...
      if (parsedObjectCache.get(instance[key]) == undefined) {
        // Cache the result of this parse operation in our map
        parsedObjectCache.set(instance[key], parseObjectDescriptor(instance[key]))
      }
      // Set this to our cached result for this type of object
      description.properties[key] = parsedObjectCache.get(instance[key])
      return
    }

    // Find the appropiate parser for this property
    const parser = identifierParserMap[instance[key].type] as any

    // If one wasn't found throw an error
    if (parser == undefined) {
      throw new Error()
    }

    // Set the description.type[key] to the parsed value of the instance[key]
    if (parsedObjectCache.get(instance[key]) != undefined) {
      description.properties[key] = parsedObjectCache.get(instance[key])
    }

    description.properties[key] = parser(instance[key])
  })

  return description
}

/**
 * Parses the action descriptor
 * @param descriptor The action descriptor
 */
function parseActionDescriptor(descriptor: ActionDescriptor<(...args: any[]) => void>) {
  if (typeof descriptor.fn !== 'function') {
    throw new Error()
  }
  return descriptor
}

/**
 * Parses the array of descriptor
 * @param descriptor The descriptor of the array
 */
function parseArrayOfDescriptor(descriptor: ArrayOfDescriptor<any>) {
  if (descriptor.type !== types.arrayOf) {
    throw new Error()
  }

  if (typeof descriptor.kind !== 'object') {
    throw new Error()
  }

  if (descriptor.kind.type === types.action) {
    throw new Error()
  }

  if (descriptor.kind.type === types.computed) {
    throw new Error()
  }

  if (identifierParserMap[descriptor.kind.type] == undefined) {
    throw new Error()
  }

  if (descriptor.kind.type === types.object) {
    descriptor.kind = parseObjectDescriptor(descriptor.kind)
  }

  return descriptor
}

/**
 * Parses the complex descriptor
 * @param descriptor The complex descriptor
 */
function parseComplexDescriptor(descriptor: ComplexDescriptor<any, any>) {
  if (typeof descriptor.serialize !== 'function') {
    throw new Error()
  }
  if (typeof descriptor.deserialize !== 'function') {
    throw new Error()
  }
  return descriptor
}

/**
 * Ensures the computed fn property is a function
 * @param descriptor The computed type descriptor
 */
function parseComputedDescriptor(descriptor: ComputedDescriptor<any>) {
  if (typeof descriptor.fn !== 'function') {
    throw new Error()
  }
  return descriptor
}

/**
 * Parses the mapOf descriptor
 * @param descriptor The mapOf descriptor
 */
function parseMapOfDescriptor(descriptor: MapOfDescriptor<any>) {
    if (descriptor.type !== types.mapOf) {
    throw new Error()
  }

  if (typeof descriptor.kind !== 'object') {
    throw new Error()
  }

  if (descriptor.kind.type === types.action) {
    throw new Error()
  }

  if (descriptor.kind.type === types.computed) {
    throw new Error()
  }

  if (identifierParserMap[descriptor.kind.type] == undefined) {
    throw new Error()
  }

  if (descriptor.kind.type === types.object) {
    descriptor.kind = parseObjectDescriptor(descriptor.kind)
  }

  return descriptor
}

type PrimitiveDescriptor = NumberDescriptor | BooleanDescriptor | StringDescriptor

/**
 * Parses the primitive descriptor (since it's primitive though it actually doesn't do anything)
 * @param descriptor The primitive descriptor
 */
function parsePrimitiveDescriptor(descriptor: PrimitiveDescriptor) {
  return { ...descriptor }
}

/**
 * Parses the oneOf descriptor
 * @param descriptor The oneOf descriptor
 */
function parseOneOfDescriptor(descriptor: OneOfDescriptor) {
  if (descriptor.type !== types.oneOf) {
    throw new Error()
  }
  if (!(descriptor.kinds instanceof Array)) {
    throw new Error()
  }
  descriptor.kinds.forEach((kind, index) => {
    if (kind.type === types.object) {
      descriptor.kinds[index] = parseObjectDescriptor(kind)
      return
    }
    if (kind.type === types.action) {
      throw new Error()
    }
    if (kind.type === types.computed) {
      throw new Error()
    }
    if (identifierParserMap[kind.type] == undefined) {
      throw new Error()
    }
  })
  return descriptor
}
