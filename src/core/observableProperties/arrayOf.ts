import * as core from '../../core'

export const arrayOfProperty: core.Property = {
  set(target, key, value, description: core.ArrayOfDescriptor<any>, root) {
    if (core.isObservable(value)) {
      return value
    }

    const proxy = new Proxy(value, {
      setPrototypeOf(): boolean {
        throw new Error('setPrototypeOf is disabled for fnx objects')
      },
      defineProperty(): boolean {
        throw new Error('Define property is disabled for fnx objects')
      },
      deleteProperty(): boolean {
        throw new Error('The delete operator may only be used for properties in maps')
      },
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
            const result = JSON.stringify(proxy, (_, v) => v === undefined ? null : v)
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
        if (k === 'length') {
          return Reflect.set(t, k, v)
        } else {
          return core.setProperty(t, k, v, description.kind, root)
        }
      }
    })

    if (Object.getOwnPropertySymbols(value).length > 0) {
      throw new Error(
        'Symbols are not serializable and therefore you can\'t use them as a key on your state'
      )
    }

    Object.getOwnPropertyNames(value).forEach(k => {
      if (k !== 'length') {
        core.setProperty(value, k, value[k], description.kind, root)
      }
    })

    return {
      didChange: true,
      result: Reflect.set(target, key, proxy)
    }
  },
  get(target, key) {
    return target[key]
  }
}
