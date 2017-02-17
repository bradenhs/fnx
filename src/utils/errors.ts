export class AttemptedTriggeringTransactionInsideTransaction extends Error { }

export class AttemptedCallingActionInsideAction extends Error { }

export class AttemptedMutationOutsideAction extends Error { }

export class AttemptedMutationOfAction extends Error { }

export class AttemptedObserveOnUnobservableObject extends Error { }

export class AttemptedObserveOnSymbol extends Error { }

export class AttemptedObserveOnAccessorDescriptor extends Error { }
