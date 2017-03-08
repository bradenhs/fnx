import { MapOfDescriptor, types } from '../core'

/**
 * TODO
 * @param kind TODO
 */
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
