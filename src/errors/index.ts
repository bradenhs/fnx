export class TypeofObjectNotFunction extends Error {
  constructor(actualTypeofDescription: string) {
    super()
    console.log(actualTypeofDescription)
  }
}

export class UnexpectedPropertyFoundOnPrototype extends Error {
  constructor(unexpectedProperty: string) {
    super()
    console.log(unexpectedProperty)
  }
}

export class UnexpectedSymbolFoundOnPrototype extends Error {
  constructor(unexpectedSymbol: symbol) {
    super()
    console.log(unexpectedSymbol)
  }
}

export class TypeofInstancePropertyNotObject extends Error {
  constructor(actualTypeofInstanceProperty: string) {
    super()
    console.log(actualTypeofInstanceProperty)
  }
}

export class InvalidInstancePropertyIdentifier extends Error {
  constructor(instance, key) {
    super()
    console.log(instance, key)
  }
}

export class InvalidArrayOfType extends Error { }
export class ActionIsInvalidArrayOfType extends Error { }
export class ComputedIsInvalidArrayOfType extends Error { }

export class InvalidMapOfType extends Error { }
export class ActionIsInvalidMapOfType extends Error { }
export class ComputedIsInvalidMapOfType extends Error { }

export class InvalidOneOfType extends Error { }
export class ActionIsInvalidOneOfType extends Error { }
export class ComputedIsInvalidOneOfType extends Error { }

export class ActionFactoryExpectedFunction extends Error { }
export class ComputedFactoryExpectedFunction extends Error { }
export class ComplexFactoryExpectedFunctionForSerializer extends Error { }
export class ComplexFactoryExpectedFunctionForDeserializer extends Error { }
