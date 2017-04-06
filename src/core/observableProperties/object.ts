import * as core from '../../core'
import { ObjectKeyWeakMap } from '../../utils'

const skipInit = new ObjectKeyWeakMap()

export function skipPropertyInitialization(target, property) {
  skipInit.set(target, property, true)
}

export const objectProperty: core.Property = {
  set(target, key, value, description: core.ParsedObjectDescriptor<any>, root) {
    if (typeof value !== 'object') {
      throw new Error('tried to set object to non-object value')
    }

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

        if (typeof description.properties[k] === 'function') {
          return description.properties[k]
        }

        return core.getProperty(t, k, description.properties[k], root || proxy, proxy)
      },
      set(t, k, v) {
        if (skipInit.get(proxy, k)) {
          return skipInit.set(proxy, k, false)
        }
        if (!core.isActionInProgress(root || proxy)) {
          throw new Error(`You cannot mutate state outside of an action "${k.toString()}"`)
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
        typeof description.properties[k] !== 'function' &&
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
