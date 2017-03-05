import * as Error from '../errors'
import {
  identifiers,
  ActionTypeDescriptor,
  ArrayOfTypeDescriptor,
  BooleanTypeDescriptor,
  ComplexTypeDescriptor,
  ComputedTypeDescriptor,
  MapOfTypeDescriptor,
  NumberTypeDescriptor,
  ObjectTypeDescriptor,
  ParsedObjectTypeDescriptor,
  OneOfTypeDescriptor,
  StringTypeDescriptor,
} from '../core'

// Create a map of identifiers and their corresponding parsers
const identifierParserMap = {
  [identifiers.action]: parseActionDescriptor,
  [identifiers.arrayOf]: parseArrayOfDescriptor,
  [identifiers.boolean]: parsePrimitiveDescriptor,
  [identifiers.complex]: parseComplexDescriptor,
  [identifiers.computed]: parseComputedDescriptor,
  [identifiers.mapOf]: parseMapOfDescriptor,
  [identifiers.number]: parsePrimitiveDescriptor,
  [identifiers.object]: parseObjectDescriptor,
  [identifiers.oneOf]: parseOneOfDescriptor,
  [identifiers.string]: parsePrimitiveDescriptor,
}

/**
 * Parses and validates the provided description into a usable format
 * @param Description The description of the observable
 */
export function parseDescription(Description: new() => any) {
  return parseObjectDescriptor({
    identifier: identifiers.object,
    readonly: true, optional: false,
    type: Description,
  })
}

/**
 * Parses and validates the provided object descriptor
 * @param descriptor The object descriptor
 */
function parseObjectDescriptor<T>(descriptor: ObjectTypeDescriptor<T>) {
  // Ensure it's type is a class
  if (typeof descriptor.type !== 'function') {
    throw new Error.TypeofObjectNotFunction(typeof descriptor.type)
  }

  // Initialize arrays for keeping track of properties that need to be marked
  // as readonly or optional
  let readonlyProperties = []
  let optionalProperties = []

  // Ready a reassignable prototype variable
  let prototype = descriptor.type.prototype

  // Walk up the prototype chain
  do {
    // 'constructor' should be the only property name defined
    if (Object.getOwnPropertyNames(prototype).length > 1) {
      throw new Error.UnexpectedPropertyFoundOnPrototype(
        Object.getOwnPropertyNames(prototype)[1])
    }

    // Get the symbols
    const symbols = Object.getOwnPropertySymbols(prototype)

    // If it has the readonly symbol add it's contents to the readonly array
    if (prototype[identifiers.readonly] != undefined) {
      readonlyProperties = [
        ...readonlyProperties,
        ...Object.keys(prototype[identifiers.readonly])
      ]
      // Remove this from the symbol list
      symbols.splice(symbols.indexOf(identifiers.readonly), 1)
    }

    // If it has the optional symbol add it's contents to the optional array
    if (prototype[identifiers.optional] != undefined) {
      optionalProperties = [
        ...optionalProperties,
        ...Object.keys(prototype[identifiers.optional])
      ]
      // Remove this from the symbol list
      symbols.splice(symbols.indexOf(identifiers.optional), 1)
    }

    // If any symbols are left they're extraneous so throw an error
    if (symbols.length > 0) {
      throw new Error.UnexpectedSymbolFoundOnPrototype(symbols[0])
    }

    // Get the parent prototype and keep walking up the chain until we reach
    // Object.prototype
    prototype = Object.getPrototypeOf(prototype)
  } while (prototype !== Object.prototype)

  // Create a new instance of descriptor.type
  const instance = new descriptor.type()

  // Mark readonly properties
  readonlyProperties.forEach(key => {
    instance[key].readonly = true
  })

  // Mark optional properties
  optionalProperties.forEach(key => {
    instance[key].optional = true
  })

  // Initialize ParsedObjectTypeDescriptor to build and then return it as the description
  const description: ParsedObjectTypeDescriptor<any> = {
    readonly: descriptor.readonly, optional: descriptor.optional,
    type: { }, identifier: descriptor.identifier,
  }

  Object.keys(instance).forEach(key => {
    // Ensure all properties are objects
    if (typeof instance[key] !== 'object') {
      throw new Error.TypeofInstancePropertyNotObject(typeof instance[key])
    }

    // Find the appropiate parser for this object
    const parser = identifierParserMap[instance[key].identifier] as any

    // If one wasn't found throw and error
    if (parser == undefined) {
      throw new Error.InvalidInstancePropertyIdentifier(instance, key)
    }

    // Set the description.type[key] to the parsed value of the instance[key]
    description.type[key] = parser(instance[key])
  })

  return description
}

/**
 * Parses the action descriptor
 * @param descriptor The action descriptor
 */
function parseActionDescriptor(descriptor: ActionTypeDescriptor<(...args: any[]) => void>) {
  if (typeof descriptor.fn !== 'function') {
    throw new Error.ActionFactoryExpectedFunction()
  }
  return descriptor
}

/**
 * Parses the array of descriptor
 * @param descriptor The descriptor of the array
 */
function parseArrayOfDescriptor(descriptor: ArrayOfTypeDescriptor<any>) {
  if (descriptor.type != undefined && descriptor.type.identifier === identifiers.object) {
    return parseObjectDescriptor(descriptor.type)
  }
  if (identifierParserMap[descriptor.type] == undefined) {
    throw new Error.InvalidArrayOfType()
  }
  if (descriptor.type === identifiers.action) {
    throw new Error.ActionIsInvalidArrayOfType()
  }
  if (descriptor.type === identifiers.computed) {
    throw new Error.ComputedIsInvalidArrayOfType()
  }
  return descriptor
}

/**
 * Parses the complex descriptor
 * @param descriptor The complex descriptor
 */
function parseComplexDescriptor(descriptor: ComplexTypeDescriptor<any, any>) {
  if (typeof descriptor.serialize !== 'function') {
    throw new Error.ComplexFactoryExpectedFunctionForSerializer()
  }
  if (typeof descriptor.deserialize !== 'function') {
    throw new Error.ComplexFactoryExpectedFunctionForDeserializer()
  }
  return descriptor
}

/**
 * Ensures the computed fn property is a function
 * @param descriptor The computed type descriptor
 */
function parseComputedDescriptor(descriptor: ComputedTypeDescriptor<any>) {
  if (typeof descriptor.fn !== 'function') {
    throw new Error.ComputedFactoryExpectedFunction()
  }
  return descriptor
}

/**
 * Parses the mapOf descriptor
 * @param descriptor The mapOf descriptor
 */
function parseMapOfDescriptor(descriptor: MapOfTypeDescriptor<any>) {
  if (descriptor.type != undefined && descriptor.type.identifier === identifiers.object) {
    return parseObjectDescriptor(descriptor.type)
  }
  if (identifierParserMap[descriptor.type] == undefined) {
    throw new Error.InvalidMapOfType()
  }
  if (descriptor.type === identifiers.action) {
    throw new Error.ActionIsInvalidMapOfType()
  }
  if (descriptor.type === identifiers.computed) {
    throw new Error.ComputedIsInvalidMapOfType()
  }
  return descriptor
}

/**
 * Parses the primitive descriptor (since it's primitive though it actually doesn't do anything)
 * @param descriptor The primitive descriptor
 */
function parsePrimitiveDescriptor(descriptor: NumberTypeDescriptor | BooleanTypeDescriptor | StringTypeDescriptor) {
  return descriptor
}

/**
 * Parses the oneOf descriptor
 * @param descriptor The oneOf descriptor
 */
function parseOneOfDescriptor(descriptor: OneOfTypeDescriptor) {
  descriptor.types.forEach((type, index) => {
    if (type != undefined && type.identifier === identifiers.object) {
      descriptor.types[index] = parseObjectDescriptor(type)
      return
    }
    if (identifierParserMap[type] == undefined) {
      throw new Error.InvalidOneOfType()
    }
    if (type === identifiers.action) {
      throw new Error.ActionIsInvalidOneOfType()
    }
    if (type === identifiers.computed) {
      throw new Error.ComputedIsInvalidOneOfType()
    }
  })
  return descriptor
}
