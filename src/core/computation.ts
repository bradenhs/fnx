import * as core from '../core'
import { ObjectKeyWeakMap } from '../utils'

export interface Computation {
  readonly id: symbol
  readonly fn: Function
  readonly object: object
  readonly key: PropertyKey
  stale: boolean
  value: any
  round: number
}

let activeComputation: Computation

const computations = new ObjectKeyWeakMap<any, Computation>()

export function wrapComputation(proxy, key, fn: () => any) {
  return (...args: any[]) => {
    if (args.length > 0) {
      throw new Error('Computed values should take no parameters')
    }

    if (core.isReactionInProgress()) {
      const reaction = core.getActiveReaction()
      core.addReactionToObservable(proxy, key, reaction.id, reaction.round)
    }

    if (isComputationInProgress()) {
      core.addComputationToObservable(proxy, key, activeComputation)
    }

    const computation = core.getComputation(proxy, key, fn)

    if (!computation.stale) {
      return computation.value
    }
    const lastActiveComputation = activeComputation
    activeComputation = computation
    computation.round++
    computation.value = computation.fn.bind(proxy)()
    computation.stale = false
    activeComputation = lastActiveComputation
    return computation.value
  }
}

export function getComputation(proxy, key, fn: () => any) {
  if (computations.has(proxy, key)) {
    return computations.get(proxy, key)
  } else {
    const computation: Computation = {
      object: proxy, key, id: Symbol(), fn, round: 0, stale: true, value: undefined
    }
    computations.set(proxy, key, computation)
    return computation
  }
}

export function isComputationInProgress() {
  return activeComputation != undefined
}

export function getActiveComputation() {
  return activeComputation
}
