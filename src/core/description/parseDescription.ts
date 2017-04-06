import { Model } from '../../api/Model'
import {
  ActionDescriptor, ArrayOfDescriptor, BooleanDescriptor, ComplexDescriptor, ComputedDescriptor,
  descriptionTypes, MapOfDescriptor, NumberDescriptor, ObjectDescriptor, OneOfDescriptor,
  ParsedObjectDescriptor, StringDescriptor,
} from './'

// Create a map of identifiers and their corresponding parsers
const identifierParserMap = {
  [descriptionTypes.action]: parseActionDescriptor,
  [descriptionTypes.arrayOf]: parseArrayOfDescriptor,
  [descriptionTypes.boolean]: parsePrimitiveDescriptor,
  [descriptionTypes.complex]: parseComplexDescriptor,
  [descriptionTypes.computed]: parseComputedDescriptor,
  [descriptionTypes.mapOf]: parseMapOfDescriptor,
  [descriptionTypes.number]: parsePrimitiveDescriptor,
  [descriptionTypes.object]: parseObjectDescriptor,
  [descriptionTypes.oneOf]: parseOneOfDescriptor,
  [descriptionTypes.string]: parsePrimitiveDescriptor,
}

// Keeps a cache of parsed classes so we don't have to keep parsing them
const parsedObjectCache = new WeakMap<new () => any, ParsedObjectDescriptor<any>>()

/**
 * Parses and validates the provided description into a usable format
 * @param Description The description of the observable
 */
export function parseDescription(Description: new(initialState?: any) => any) {
  const description = parseObjectDescriptor({
    type: descriptionTypes.object,
    readonly: true, optional: false,
    clazz: Description,
  })
  return description
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

  if (parsedObjectCache.has(descriptor.clazz)) {
    return parsedObjectCache.get(descriptor.clazz)
  }

  // Initialize arrays for keeping track of properties that need to be marked
  // as readonly or optional
  let readonlyProperties = []
  let optionalProperties = []

  // Ready a reassignable prototype variable
  let prototype = descriptor.clazz.prototype

  if (prototype == undefined) {
    throw new Error('Class prototype is undefined')
  }

  const prototypeProperties: { [key: string]: any } = { }

  // Walk up the prototype chain
  do {
    Object.getOwnPropertyNames(prototype).forEach(key => {
      if (key === 'constructor') {
        return
      }
      prototypeProperties[key] = prototype[key]
    })

    // Get the symbols
    const symbols = Object.getOwnPropertySymbols(prototype)

    // If it has the readonly symbol add it's contents to the readonly array
    if (prototype[descriptionTypes.readonly] != undefined) {
      readonlyProperties = [
        ...readonlyProperties,
        ...Object.keys(prototype[descriptionTypes.readonly])
      ]
      // Remove this from the symbol list
      symbols.splice(symbols.indexOf(descriptionTypes.readonly), 1)
    }

    // If it has the optional symbol add it's contents to the optional array
    if (prototype[descriptionTypes.optional] != undefined) {
      optionalProperties = [
        ...optionalProperties,
        ...Object.keys(prototype[descriptionTypes.optional])
      ]
      // Remove this from the symbol list
      symbols.splice(symbols.indexOf(descriptionTypes.optional), 1)
    }

    // If any symbols are left they're extraneous so throw an error
    if (symbols.length > 0) {
      throw new Error('Symbols should not be properties')
    }

    // Get the parent prototype and keep walking up the chain until we reach
    // Object.prototype
    prototype = Object.getPrototypeOf(prototype)
    if (prototype === Object.prototype) {
      throw new Error('Description must extend model')
    }
  } while (prototype !== Model.prototype)

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
    properties: prototypeProperties, type: descriptor.type,
  }

  Object.keys(instance).forEach(key => {
    // Ensure all properties are objects
    if (typeof instance[key] !== 'object') {
      throw new Error('Found invalid property on description')
    }

    // If this is an object descriptor run this instead
    if (instance[key].identifier === descriptionTypes.object) {
      // Set this to our cached result for this type of object
      description.properties[key] = parsedObjectCache.get(instance[key])
      return
    }

    // Find the appropiate parser for this property
    const parser = identifierParserMap[instance[key].type] as any

    // If one wasn't found throw an error
    if (parser == undefined) {
      throw new Error('Invalid property descriptor type')
    }

    // Set the description.type[key] to the parsed value of the instance[key]
    description.properties[key] = parser(instance[key])
  })

  parsedObjectCache.set(descriptor.clazz, description)

  return description
}

/**
 * Parses the action descriptor
 * @param descriptor The action descriptor
 */
function parseActionDescriptor(descriptor: ActionDescriptor<(...args: any[]) => void>) {
  if (typeof descriptor.fn !== 'function') {
    throw new Error('Actions should be made of functions')
  }
  return descriptor
}

/**
 * Parses the array of descriptor
 * @param descriptor The descriptor of the array
 */
function parseArrayOfDescriptor(descriptor: ArrayOfDescriptor<any>) {
  if (descriptor.type !== descriptionTypes.arrayOf) {
    throw new Error('Should be arrayOf')
  }

  if (typeof descriptor.kind !== 'object') {
    throw new Error('Invalid property kind on arrayOf')
  }

  if (descriptor.kind.type === descriptionTypes.action) {
    throw new Error('the type of the kind cannot be an action for arrayOf')
  }

  if (descriptor.kind.type === descriptionTypes.computed) {
    throw new Error('the type of the kind cannot be a computed property for arrayof')
  }

  if (identifierParserMap[descriptor.kind.type] == undefined) {
    throw new Error('invalid type for kind in arrayOf')
  }

  if (descriptor.kind.type === descriptionTypes.object) {
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
    throw new Error('complex serialize parameter should be function')
  }
  if (typeof descriptor.deserialize !== 'function') {
    throw new Error('complex deserialize parameter should be a function')
  }
  return descriptor
}

/**
 * Ensures the computed fn property is a function
 * @param descriptor The computed type descriptor
 */
function parseComputedDescriptor(descriptor: ComputedDescriptor<any>) {
  if (typeof descriptor.fn !== 'function') {
    throw new Error('Computed property should have function')
  }
  return descriptor
}

/**
 * Parses the mapOf descriptor
 * @param descriptor The mapOf descriptor
 */
function parseMapOfDescriptor(descriptor: MapOfDescriptor<any>) {
    if (descriptor.type !== descriptionTypes.mapOf) {
    throw new Error()
  }

  if (typeof descriptor.kind !== 'object') {
    throw new Error()
  }

  if (descriptor.kind.type === descriptionTypes.action) {
    throw new Error()
  }

  if (descriptor.kind.type === descriptionTypes.computed) {
    throw new Error()
  }

  if (identifierParserMap[descriptor.kind.type] == undefined) {
    throw new Error()
  }

  if (descriptor.kind.type === descriptionTypes.object) {
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
  if (descriptor.type !== descriptionTypes.oneOf) {
    throw new Error()
  }
  if (!(descriptor.kinds instanceof Array)) {
    throw new Error()
  }
  descriptor.kinds.forEach((kind, index) => {
    if (kind.type === descriptionTypes.object) {
      descriptor.kinds[index] = parseObjectDescriptor(kind)
      return
    }
    if (kind.type === descriptionTypes.action) {
      throw new Error()
    }
    if (kind.type === descriptionTypes.computed) {
      throw new Error()
    }
    if (identifierParserMap[kind.type] == undefined) {
      throw new Error()
    }
  })
  return descriptor
}
