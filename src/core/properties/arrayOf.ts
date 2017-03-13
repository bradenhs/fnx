import * as core from '../../core'

/**
 *  Creates an observable array
 * @param array The plain array
 * @param description The description of this array
 * @param root The root of the state tree
 */
export function prepareArrayOf(
  array, description: core.ArrayOfDescriptor<any>, root
) {
  if (core.isObservable(array)) {
    return array
  }

  const proxy = new Proxy(array, {
    /**
     * TODO
     */
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
    /**
     * TODO
     */
    set(target, key, value) {
      if (!core.isActionInProgress(root)) {
        throw new Error('You cannot mutate state outside of an action')
      }
      if (key === 'length') {
        return Reflect.set(target, key, value)
      } else {
        return core.setProperty(
          target, key, value, description.kind, root
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
      core.setProperty(array, key, array[key], description.kind, root)
    }
  })

  return proxy
}
