import {
  TypeofObjectNotFunction,
  UnexpectedPropertyFoundOnPrototype,
  UnexpectedSymbolFoundOnPrototype,
  TypeofInstancePropertyNotObject,
  InvalidInstancePropertyIdentifier,
} from '../utils'
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
  OneOfTypeDescriptor,
  StringTypeDescriptor,
} from '../core'

export function parseDescription(Description: new() => any) {
  return parseObjectDescriptor({
    identifier: identifiers.object,
    readonly: true, optional: false,
    type: Description,
  })
}

function parseObjectDescriptor<T>(descriptor: ObjectTypeDescriptor<T>) {
  if (typeof descriptor.type !== 'function') {
    throw new TypeofObjectNotFunction(typeof descriptor.type)
  }

  let prototype = descriptor.type.prototype

  do {
    if (Object.getOwnPropertyNames(prototype).length > 1) {
      throw new UnexpectedPropertyFoundOnPrototype(
        Object.getOwnPropertyNames(prototype)[1])
    }

    if (Object.getOwnPropertySymbols(prototype).length > 0) {
      throw new UnexpectedSymbolFoundOnPrototype(
        Object.getOwnPropertySymbols(prototype)[0])
    }
    prototype = Object.getPrototypeOf(prototype)
  } while (prototype !== Object.prototype)

  const description = new descriptor.type()

  Object.keys(description).forEach(key => {
    if (typeof description[key] !== 'object') {
      throw new TypeofInstancePropertyNotObject(typeof description[key])
    }

    const parser = {
      [identifiers.action]: parseActionDescriptor,
      [identifiers.arrayOf]: parseArrayOfDescriptor,
      [identifiers.boolean]: parseBooleanDescriptor,
      [identifiers.complex]: parseComplexDescriptor,
      [identifiers.computed]: parseComputedDescriptor,
      [identifiers.mapOf]: parseMapOfDescriptor,
      [identifiers.number]: parseNumberDescriptor,
      [identifiers.object]: parseObjectDescriptor,
      [identifiers.oneOf]: parseOneOfDescriptor,
      [identifiers.string]: parseStringDescriptor,
    }[description[key].identifier] as any

    if (parser == undefined) {
      throw new InvalidInstancePropertyIdentifier(description, key)
    }

    description[key] = parser(description[key])
  })

  return description
}

function parseActionDescriptor(descriptor: ActionTypeDescriptor<(...args: any[]) => void>) {
  console.log('parseAction', descriptor)
}

function parseArrayOfDescriptor(descriptor: ArrayOfTypeDescriptor<any>) {
  console.log('parseArrayOf', descriptor)
}

function parseBooleanDescriptor(descriptor: BooleanTypeDescriptor) {
  console.log('boolean', descriptor)
}

function parseComplexDescriptor(descriptor: ComplexTypeDescriptor<any, any>) {
  console.log('complex', descriptor)
}

function parseComputedDescriptor(descriptor: ComputedTypeDescriptor<any>) {
  console.log('computed', descriptor)
}

function parseMapOfDescriptor(descriptor: MapOfTypeDescriptor<any>) {
  console.log('mapOf', descriptor)
}

function parseNumberDescriptor(descriptor: NumberTypeDescriptor) {
  console.log('number', descriptor)
}

function parseOneOfDescriptor(descriptor: OneOfTypeDescriptor) {
  console.log('oneOf', descriptor)
}

function parseStringDescriptor(descriptor: StringTypeDescriptor) {
  console.log('string', descriptor)
}
