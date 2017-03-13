import * as core from '../../core'

export function prepareObject(
  object, description: core.ParsedObjectDescriptor<any>, root?
) {
  if (core.isObservable(object)) {
    return object
  }

  const proxy = new Proxy(object, {
    get(target, key, receiver) {
      if (core.isObservableDesignatorKey(key)) {
        return true
      }

      if (description.properties[key] != undefined) {
        if (description.properties[key].type === core.types.action) {
          const action = description.properties[key].fn(proxy, root || proxy)

          if (typeof action !== 'function') {
            throw new Error('Actions should be a function returning another function to be called')
          }

          return (...args: any[]) => {
            core.incrementActionsInProgress(root || proxy)
            action(...args)
            core.decrementActionsInProgress(root || proxy)
          }
        }

        if (description.properties[key].type === core.types.computed) {
          throw new Error('TODO make it so computed values work properly with staleness')
        }

        if (description.properties[key].type === core.types.complex) {
          throw new Error('TODO make it so complex values work properly')
        }
      }

      return Reflect.get(target, key, receiver)
    },
    set(target, key, value) {
      if (!core.isActionInProgress(root || proxy)) {
        throw new Error('You cannot mutate state outside of an action')
      }
      if (!Reflect.has(description.properties, key)) {
        throw new Error(`The description for this object does not include ${key}`)
      }
      if (description.properties[key].readonly) {
        throw new Error('Tried to mutate readonly value')
      }
      return core.setProperty(
        target, key, value, description.properties[key], root || proxy
      )
    }
  })

  if (Object.getOwnPropertySymbols(proxy).length > 0) {
    throw new Error(
      'Symbols are not serializable and therefore you can\'t use them as a key on your state'
    )
  }

  const hasExtraneousProperties = Object.getOwnPropertyNames(object)
      .some(k => Object.getOwnPropertyNames(description.properties).indexOf(k) === -1)

  if (hasExtraneousProperties) {
    throw new Error('Extraneous properties on object')
  }

  Object.getOwnPropertyNames(description.properties).forEach(key => {
    if (Object.getOwnPropertyNames(object).indexOf(key) >= 0) {
      core.setProperty(object, key, object[key], description.properties[key], root || proxy)
    } else if (
      description.properties[key].optional !== true &&
      description.properties[key].type !== core.types.action &&
      description.properties[key].type !== core.types.computed
    ) {
      throw new Error('required property not on object')
    }
  })

  return proxy
}
