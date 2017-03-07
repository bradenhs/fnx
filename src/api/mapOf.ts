import { types, MapOfDescriptor } from '../core'

export function mapOf<T>(kind: T) {
  const descriptor: MapOfDescriptor<T> = {
    type: types.mapOf, kind,
    readonly: false, optional: false,
  }
  return descriptor as any as {
    [key: string]: T;
    [key: number]: T;
  }
}
