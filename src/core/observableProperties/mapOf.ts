import * as core from '../../core'

export const mapOfProperty: core.Property = {
  set(target, key, value, description: core.ArrayOfDescriptor<any>, root) {
    // TODO verify not just that it is an observable
    if (core.isObservable(value)) {
      return value
    }

    const proxy = new Proxy(value, {
      get(t, k) {
        if (core.isObservableDesignatorKey(k)) {
          return true
        }

        if (core.isDescriptionDesignator(k)) {
          return description
        }
        if (k === 'toString') {
          return () => {
            core.incrementSerializationCounter()
            const result = JSON.stringify(proxy)
            core.decrementSerializationCounter()
            return result
          }
        }

        return core.getProperty(t, k, description.kind, root, proxy)
      },
      set(t, k, v) {
        if (!core.isActionInProgress(root)) {
          throw new Error('You cannot mutate state outside of an action')
        }

        // This is a new property meaning we should trigger a change for the parent
        if (!Reflect.has(t, k)) {
          core.markObservablesDerivationsAsStale(target, key)
          core.addObservablesReactionsToPendingReactions(target, key)
        }

        return core.setProperty(t, k, v, description.kind, root)
      }
    })

    if (Object.getOwnPropertySymbols(proxy).length > 0) {
      throw new Error(
        'Symbols are not serializable and therefore you can\'t use them as a key on your state'
      )
    }

    Object.getOwnPropertyNames(value).forEach(k => {
      core.setProperty(value, k, value[k], description.kind, root)
    })

    return {
      didChange: true, result: Reflect.set(target, key, proxy)
    }
  },
  get(target, key) {
    return target[key]
  }
}
