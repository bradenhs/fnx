export const identifiers = {
  // Non-serializable types
  computed: Symbol('computed'),

  // Serializable Types
  string: Symbol('string'),
  boolean: Symbol('boolean'),
  number: Symbol('number'),
  complex: Symbol('complex'),
  object: Symbol('object'),
  arrayOf: Symbol('arrayOf'),
  mapOf: Symbol('mapOf'),
  oneOf: Symbol('oneOf'),
};
