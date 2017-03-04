// Base interface for all type descriptors
export interface TypeDescriptor {
  identifier: Symbol
}

// Non-serializable descriptors

export interface ActionTypeDescriptor<T extends (...args: any[]) => void> extends TypeDescriptor {
  fn(): T
}

export interface ComputedTypeDescriptor<T> extends TypeDescriptor {
  fn(): T
}

// Serializable descriptors

export interface ObjectTypeDescriptor<T> extends TypeDescriptor {
  type: { new(): T }
  readonly: boolean
  optional: boolean
}

export interface OneOfTypeDescriptor extends TypeDescriptor {
  types: any[]
  readonly: boolean
  optional: boolean
}

export interface ArrayOfTypeDescriptor<T> extends TypeDescriptor {
  type: T
  readonly: boolean
  optional: boolean
}

export interface MapOfTypeDescriptor<T> extends TypeDescriptor {
  type: T
  readonly: boolean
  optional: boolean
}

export interface ComplexTypeDescriptor<ComplexType, SimpleType> extends TypeDescriptor {
  serialize: (complexValue: ComplexType) => SimpleType
  deserialize: (simpleValue: SimpleType) => ComplexType
  readonly: boolean
  optional: boolean
}

// Primitive serializable type descriptors

export interface BooleanTypeDescriptor extends TypeDescriptor {
  readonly: boolean
  optional: boolean
}

export interface NumberTypeDescriptor extends TypeDescriptor {
  readonly: boolean
  optional: boolean
}

export interface StringTypeDescriptor extends TypeDescriptor {
  readonly: boolean
  optional: boolean
}
