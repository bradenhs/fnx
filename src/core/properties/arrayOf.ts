import * as core from '../../core'

export function prepareArrayOf(
  array, description: core.ArrayOfDescriptor<any>, root?
) {
  if (core.isObservable(array)) {
    return array
  }

  const proxy = new Proxy(array, {
    get(target, key, receiver) {
      if (core.isObservableDesignatorKey(key)) {
        return true
      }

      if (description.kind === core.types.computed) {
        throw new Error('TODO make it so computed values work properly with staleness')
      }

      if (description.kind === core.types.complex) {
        throw new Error('TODO make it so complex values work properly')
      }

      return Reflect.get(target, key, receiver)
    },
    set(target, key, value) {
      if (!core.isActionInProgress(root || proxy)) {
        throw new Error('You cannot mutate state outside of an action')
      }
      if (key === 'length') {
        return Reflect.set(target, key, value)
      } else {
        return core.setProperty(
          target, key, value, description.kind, root || proxy
        )
      }
    }
  })

  if (Object.getOwnPropertySymbols(proxy).length > 0) {
    throw new Error(
      'Symbols are not serializable and therefore you can\'t use them as a key on your state'
    )
  }

  Object.getOwnPropertyNames(array).forEach(key => {
    if (key !== 'length') {
      core.setProperty(array, key, array[key], description.kind, root || proxy)
    }
  })

  return proxy
}
