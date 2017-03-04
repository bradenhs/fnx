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
