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
 * Immediately invokes the provided function and registers it as a reaction.
 * Reactions are automatically triggered anytime any observable encountered
 * during their last last execution is modified. Reactions are used for
 * initiated effects as opposed to generating new values. Logging, persistence,
 * and updating the ui are all valid use cases for calling fnx.reaction(fn).
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
