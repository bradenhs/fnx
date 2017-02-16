import { IState } from './playground';

/**
 * This increments it
 */
export function $increment(this: IState) {
  this.counter++;
}
