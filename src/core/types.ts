export interface TypeDescriptor {
  identifier: Symbol;
}

export interface ArrayOfTypeDescriptor<T = TypeDescriptor> extends TypeDescriptor {
  type: T;
}

export interface BooleanTypeDescriptor extends TypeDescriptor { }

export interface ComplexTypeDescriptor<ComplexType, SimpleType> extends TypeDescriptor {
  serialize: (complexValue: ComplexType) => SimpleType;
  deserialize: (simpleValue: SimpleType) => ComplexType;
}

export interface ComputedTypeDescriptor<ComputedType> extends TypeDescriptor {
  fn(): ComputedType;
}

export interface MapOfTypeDescriptor<T = TypeDescriptor> extends TypeDescriptor {
  type: {
    [key: string]: T;
    [key: number]: T;
  }
}

export interface NumberTypeDescriptor extends TypeDescriptor { }

export interface ObjectTypeDescriptor<T> extends TypeDescriptor {
  type: new () => T;
}

export interface OneOfTypeDescriptor extends TypeDescriptor {
  types: any[];
}

export interface StringTypeDescriptor extends TypeDescriptor { }
