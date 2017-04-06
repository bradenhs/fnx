import * as core from '../core'
import { ObjectKeyWeakMap } from '../utils'

export interface Derivation {
  readonly id: symbol
  readonly fn: Function
  readonly object: object
  readonly key: PropertyKey
  stale: boolean
  value: any
  round: number
}

let activeDerivation: Derivation

const derivations = new ObjectKeyWeakMap<any, Derivation>()

export function wrapDerivation(target, key, description: core.ComputedDescriptor<any>, proxy) {
  return (...args: any[]) => {
    if (args.length > 0) {
      throw new Error('Computed values should take no parameters')
    }

    if (core.isReactionInProgress()) {
      const reaction = core.getActiveReaction()
      core.addReactionToObservable(target, key, reaction.id, reaction.round)
    }

    if (isDerivationInProgress()) {
      core.addDerivationToObservable(target, key, activeDerivation)
    }

    const derivation = core.getDerivation(target, key, description)

    if (!derivation.stale) {
      return derivation.value
    }
    const lastActiveDerivation = activeDerivation
    activeDerivation = derivation
    derivation.round++
    derivation.value = derivation.fn.bind(proxy)()
    derivation.stale = false
    activeDerivation = lastActiveDerivation
    return derivation.value
  }
}

export function getDerivation(target, key, description: core.ComputedDescriptor<any>) {
  if (derivations.has(target, key)) {
    return derivations.get(target, key)
  } else {
    const derivation: Derivation = {
      object: target, key, id: Symbol(), fn: description.fn, round: 0, stale: true, value: undefined
    }
    derivations.set(target, key, derivation)
    return derivation
  }
}

export function isDerivationInProgress() {
  return activeDerivation != undefined
}

export function getActiveDerivation() {
  return activeDerivation
}
