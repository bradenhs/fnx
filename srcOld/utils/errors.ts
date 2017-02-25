/**
 * Error to throw when a transaction is triggered while another transaction is
 * running.
 */
export class AttemptedTriggeringTransactionInsideTransaction extends Error { }

/**
 * Error to throw when an action triggers another action.
 */
export class AttemptedCallingActionInsideAction extends Error { }

/**
 * Error to throw when an attempt to mutate an observable is made outside of
 * an action.
 */
export class AttemptedMutationOutsideAction extends Error { }

/**
 * Error to throw when an attempt is made to mutate an observable's action.
 */
export class AttemptedMutationOfAction extends Error { }

/**
 * Error to throw when an attempt is made to observe an unobservable object.
 */
export class AttemptedObserveOnUnobservableObject extends Error { }

/**
 * Error to throw when an attempt is made to observe a symbol.
 */
export class AttemptedObserveOnSymbol extends Error { }

/**
 * Error to throw when an attempt is made to observe an accessor descriptor.
 */
export class AttemptedObserveOnAccessorDescriptor extends Error { }
