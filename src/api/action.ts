import { types, ActionDescriptor } from '../core'

export function action<T extends (...args: any[]) => void>(action: (self?, root?) => T): T {
  const descriptor: ActionDescriptor<T> = {
    type: types.action, action
  }
  return descriptor as any as T
}
