import { isValidationOn, runTransaction } from '../core';
import { validateTransactionArguments } from '../utils';

/**
 * Check this to see if we're in production mode or not. If in production some
 * blocks of code can be removed with the user's build tool.
 */
const NODE_ENV =
  typeof process !== 'undefined' ? process.env.NODE_ENV : 'development';

/**
 * Transaction batches multiple actions. Instead of actions triggering
 * reactions immediately after execution they wait until the transaction has
 * finished execution.
 */
export function transaction(fn: () => void) {
  if (NODE_ENV !== 'production' && isValidationOn()) {
    validateTransactionArguments(arguments);
  }

  runTransaction(fn);
}