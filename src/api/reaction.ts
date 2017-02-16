import {
  isValidationOn, registerReaction, invokeReaction, disposeReaction,
} from '../core';
import { validateReactionArguments } from '../utils';

/**
 * Check this to see if we're in production mode or not. If in production some
 * blocks of code can be removed with the user's build tool.
 */
const NODE_ENV =
  typeof process !== 'undefined' ? process.env.NODE_ENV : 'development';

/**
 * Reaction
 */
export function reaction(fn: () => void) {
  if (NODE_ENV !== 'production' && isValidationOn()) {
    validateReactionArguments(arguments);
  }

  const reactionId = registerReaction(fn);
  invokeReaction(reactionId);

  return dispose;

  /**
   * TODO
   */
  function dispose() {
    disposeReaction(reactionId);
  }
}
