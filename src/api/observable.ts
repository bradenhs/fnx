import { isValidationOn, createObservable, wrapActions } from '../core';
import { validateObservableArguments, ActionCollection } from '../utils';

/**
 * Check this to see if we're in production mode or not. If in production some
 * blocks of code can be removed with the user's build tool.
 */
const NODE_ENV =
  typeof process !== 'undefined' ? process.env.NODE_ENV : 'development';

/**
 * TODO
 */
export function observable<T, U>(
  object: T & object, actions: U & ActionCollection<T>,
): T & U {
  if (NODE_ENV !== 'production' && isValidationOn()) {
    validateObservableArguments(arguments);
  }

  // Generate unique id for our observable
  const rootId = Symbol();

  // Make a copy of the actions so they're safe to mutate without causing
  // site effects for the user.
  const actionsCopy = { ...(actions as object) };

  // Create our transparent proxy on the object.
  const proxy = createObservable(object, rootId, actionsCopy);

  // Wrap the actions with the code to bind them to the proxy mark valid
  // action execution.
  wrapActions(proxy, rootId, actionsCopy);

  return proxy as T & U;
}
