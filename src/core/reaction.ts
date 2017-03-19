export type Reaction = {
  readonly id: symbol
  readonly fn: () => any
  readonly invoke: () => any
  round: number
}

const reactionCollection = new Map<symbol, Reaction>()

let activeReaction: symbol

/**
 * TODO
 */
export function registerReaction(
  fn: () => any, customInvoker?: () => any,
) {
  const id = Symbol()
  const reaction: Reaction = {
    id, fn, invoke: customInvoker || (() => invokeReaction(reaction)),
    round: 0
  }
  reactionCollection.set(reaction.id, reaction)
  return reaction
}

/**
 * TODO
 */
export function invokeReaction(reaction: Reaction) {
  reaction.round++
  activeReaction = reaction.id
  const result = reaction.fn()
  activeReaction = undefined
  return result
}

/**
 * Removes reaction from reaction collection and ensures no observables
 * are set to trigger it in the future.
 */
export function disposeReaction(reactionId: symbol) {
  reactionCollection.delete(reactionId)
}

/**
 * TODO
 */
export function getReaction(reactionId: symbol) {
  return reactionCollection.get(reactionId)
}

/**
 * TODO
 */
export function isReactionInProgress() {
  return activeReaction != undefined
}

/**
 * TODO
 */
export function getActiveReaction() {
  return reactionCollection.get(activeReaction)
}

/**
 * TODO
 */
export function setActiveReactionId(reactionId: symbol) {
  activeReaction = reactionId
}

/**
 * TODO
 */
export function isInReactionCollection(reactionId: symbol) {
  return reactionCollection.has(reactionId)
}
