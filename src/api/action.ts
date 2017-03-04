import { identifiers, ActionTypeDescriptor } from '../core'

export function action<T extends (...args: any[]) => void>(fn: (self?, root?) => T): T {
  const descriptor: ActionTypeDescriptor<T> = {
    identifier: identifiers.action, fn
  }
  return descriptor as any as T
}
