import { Reaction, SymbolMap } from '../utils';

let reactionCollection: SymbolMap<Reaction> = { };

let activeReaction: symbol;

/**
 * TODO
 */
export function registerReaction(
  fn: () => any, customInvoker?: () => any,
): symbol {
  const id = Symbol();
  const reaction: Reaction = {
    id, fn, invoke: customInvoker || (() => invokeReaction(id)),
  };
  reactionCollection[reaction.id] = reaction;
  return reaction.id;
}

/**
 * TODO
 */
export function invokeReaction(reactionId: symbol) {
  const reaction = reactionCollection[reactionId];
  activeReaction = reaction.id;
  const result = reaction.fn();
  activeReaction = undefined;
  return result;
}

/**
 * Removes reaction from reaction collection and ensures no observables
 * are set to trigger it in the future.
 */
export function disposeReaction(reactionId: symbol) {
  const {
    [reactionId]: removedReaction,
    ...remainingReactions,
  } = reactionCollection;

  reactionCollection = remainingReactions;
}

/**
 * TODO
 */
export function getReaction(reactionId: symbol) {
  return reactionCollection[reactionId];
}

/**
 * TODO
 */
export function isReactionInProgress() {
  return activeReaction != undefined;
}

/**
 * TODO
 */
export function getActiveReactionId() {
  return activeReaction;
}

/**
 * TODO
 */
export function setActiveReactionId(reactionId: symbol) {
  activeReaction = reactionId;
}

/**
 * TODO
 */
export function isInReactionCollection(reactionId: symbol) {
  return reactionCollection[reactionId] != undefined;
}
