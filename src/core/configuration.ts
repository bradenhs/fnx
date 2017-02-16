import { Configuration } from '../utils';

/**
 * Check this to see if we're in production mode or not. If in production some
 * blocks of code can be removed with the user's build tool.
 */
const NODE_ENV =
  typeof process !== 'undefined' ? process.env.NODE_ENV : 'development';

/**
 * TODO
 */
export function isValidationOn() {
  return NODE_ENV !== 'production';
}

/**
 * TODO
 */
export function updateConfiguration(configuration: Configuration) {
  console.log(configuration);
}
