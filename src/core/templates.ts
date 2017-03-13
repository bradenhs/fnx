// Base interface for all type descriptors
export interface Descriptor {
  type: symbol
}

// Non-serializable descriptors

export interface ActionDescriptor<T extends (...args: any[]) => void> extends Descriptor {
  fn(): T
}

export interface ComputedDescriptor<T> extends Descriptor {
  fn(): T
}

// Serializable descriptors

export interface ParsedObjectDescriptor<T> extends Descriptor {
  properties: T & {
    [key: string]: Descriptor
    [key: number]: Descriptor
  }
  readonly: boolean
  optional: boolean
}

export interface ObjectDescriptor<T> extends Descriptor {
  clazz: { new(): T }
  readonly: boolean
  optional: boolean
}

export interface OneOfDescriptor extends Descriptor {
  kinds: any[]
  readonly: boolean
  optional: boolean
}

export interface ArrayOfDescriptor<T> extends Descriptor {
  kind: T
  readonly: boolean
  optional: boolean
}

export interface MapOfDescriptor<T> extends Descriptor {
  kind: T
  readonly: boolean
  optional: boolean
}

export interface ComplexDescriptor<ComplexType, SimpleType> extends Descriptor {
  serialize: (complexValue: ComplexType) => SimpleType
  deserialize: (simpleValue: SimpleType) => ComplexType
  readonly: boolean
  optional: boolean
}

// Primitive serializable type descriptors

export interface BooleanDescriptor extends Descriptor {
  readonly: boolean
  optional: boolean
}

export interface NumberDescriptor extends Descriptor {
  readonly: boolean
  optional: boolean
}

export interface StringDescriptor extends Descriptor {
  readonly: boolean
  optional: boolean
}

export type KeyedObject = {
  [key: string]: any
  [key: number]: any
}
