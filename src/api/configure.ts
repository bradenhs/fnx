import { isValidationOn, updateConfiguration } from '../core';
import { validateConfigureArguments, Configuration } from '../utils';

/**
 * Check this to see if we're in production mode or not. If in production some
 * blocks of code can be removed with the user's build tool.
 */
const NODE_ENV =
  typeof process !== 'undefined' ? process.env.NODE_ENV : 'development';

/**
 * TODO
 */
export function configure(configuration: Configuration) {
  if (NODE_ENV !== 'production' && isValidationOn()) {
    validateConfigureArguments(arguments);
  }

  updateConfiguration(configuration);
}

// TODO add interceptors
