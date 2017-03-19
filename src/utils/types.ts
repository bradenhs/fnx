export type PropertyKeyMap<T> = {
  [key: string]: T;
  [key: number]: T;
  // Not valid as of typescript@2.2.0rc
  // [key: symbol]: T;
}

export type KeyedObject = {
  [key: string]: any
  [key: number]: any
}

// Note: Right now symbols are not valid index signatures. This is going to
// be fixed eventually. This issue to track this can be found here
// https://github.com/Microsoft/TypeScript/issues/1863
export type SymbolMap<T> = {
  [key: string]: T;
  // Not valid as of typescript@2.2.0rc
  // [key: symbol]: T;
}
