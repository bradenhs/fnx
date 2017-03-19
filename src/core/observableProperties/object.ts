import * as core from '../../core'

export const objectProperty: core.Property = {
  set(target, key, value, description: core.ParsedObjectDescriptor<any>, root) {
    if (typeof value !== 'object') {
      throw new Error('tried to set object to non-object value')
    }

    if (core.isObservable(value)) {
      return value
    }

    const proxy = new Proxy(value, {
      get(t, k) {
        if (core.isObservableDesignatorKey(k)) {
          return true
        }
        return core.getProperty(t, k, description.properties[k], root || proxy, proxy)
      },
      set(t, k, v) {
        if (!core.isActionInProgress(root || proxy)) {
          throw new Error('You cannot mutate state outside of an action')
        }
        if (!Reflect.has(description.properties, k)) {
          throw new Error(`The description for this object does not include ${key}`)
        }
        if (description.properties[k].readonly) {
          throw new Error('Tried to mutate readonly value')
        }
        return core.setProperty(t, k, v, description.properties[k], root || proxy)
      }
    })

    if (Object.getOwnPropertySymbols(value).length > 0) {
      throw new Error(
        'Symbols are not serializable and therefore you can\'t use them as a key on your state'
      )
    }

    const hasExtraneousProperties = Object.getOwnPropertyNames(value)
        .some(k => Object.getOwnPropertyNames(description.properties).indexOf(k) === -1)

    if (hasExtraneousProperties) {
      throw new Error('Extraneous properties on object')
    }

    Object.getOwnPropertyNames(description.properties).forEach(k => {
      if (Object.getOwnPropertyNames(value).indexOf(k) >= 0) {
        core.setProperty(value, k, value[k], description.properties[k], root || proxy)
      } else if (
        description.properties[k].optional !== true &&
        description.properties[k].type !== core.descriptionTypes.action &&
        description.properties[k].type !== core.descriptionTypes.computed
      ) {
        throw new Error('required property not on object')
      }
    })

    return {
      didChange: true, result: Reflect.set(target, key, proxy)
    }
  },

  get(target, key) {
    return target[key]
  }
}
