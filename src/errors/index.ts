/**
 * TODO
 */
export class TypeofObjectNotFunction extends Error {
  constructor(actualTypeofDescription: string) {
    super()
    console.log(actualTypeofDescription)
  }
}

/**
 * TODO
 */
export class UnexpectedPropertyFoundOnPrototype extends Error {
  constructor(unexpectedProperty: string) {
    super()
    console.log(unexpectedProperty)
  }
}

/**
 * TODO
 */
export class UnexpectedSymbolFoundOnPrototype extends Error {
  constructor(unexpectedSymbol: symbol) {
    super()
    console.log(unexpectedSymbol)
  }
}

/**
 * TODO
 */
export class TypeofInstancePropertyNotObject extends Error {
  constructor(actualTypeofInstanceProperty: string) {
    super()
    console.log(actualTypeofInstanceProperty)
  }
}

/**
 * TODO
 */
export class InvalidInstancePropertyIdentifier extends Error {
  constructor(instance, key) {
    super()
    console.log(instance, key)
  }
}

/**
 * TODO
 */
export class InvalidArrayOfType extends Error { }

/**
 * TODO
 */
export class ActionIsInvalidArrayOfType extends Error { }

/**
 * TODO
 */
export class ComputedIsInvalidArrayOfType extends Error { }

/**
 * TODO
 */
export class InvalidMapOfType extends Error { }

/**
 * TODO
 */
export class ActionIsInvalidMapOfType extends Error { }

/**
 * TODO
 */
export class ComputedIsInvalidMapOfType extends Error { }

/**
 * TODO
 */
export class InvalidOneOfType extends Error { }

/**
 * TODO
 */
export class ActionIsInvalidOneOfType extends Error { }

/**
 * TODO
 */
export class ComputedIsInvalidOneOfType extends Error { }

/**
 * TODO
 */
export class ActionFactoryExpectedFunction extends Error { }

/**
 * TODO
 */
export class ComputedFactoryExpectedFunction extends Error { }

/**
 * TODO
 */
export class ComplexFactoryExpectedFunctionForSerializer extends Error { }

/**
 * TODO
 */
export class ComplexFactoryExpectedFunctionForDeserializer extends Error { }
