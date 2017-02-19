// import * as React from 'react';
// import * as ReactDOM from 'react-dom';
// import fnx from '../src/fnx';

// import ReactiveComponent from '../src/extras/react';

// export interface IState {
//   num: number;
// }

// const initialState: IState = {
//   num: 0,
// };


// type.Action
// type.Number
// type.Boolean
// type.String
// type.Complex
// type.Computed
// type.Array
// type.Object

function num(): number {
  return undefined;
}

function bool(): boolean {
  return undefined;
}

function str(): string {
  return undefined;
}

function complex<ComplexType, SimpleType extends (number | string | boolean)>(
  handle: {
    serialize(complex: ComplexType): SimpleType;
    deserialize(simple: SimpleType): ComplexType;
  },
): ComplexType {
  return undefined;
};

function computed<T>(fn: (root?) => T) {
  return fn();
}

function obj<T>(obj: { new (): T }): T {
  return undefined;
}

function arr<T>(type: T): T[] {
  return undefined;
}

function map<T>(type: T) {
  return {} as { [key: string]: T; [key: number]: T};
}

class CommentDefinition {
  readonly id = str();
  authorId = str();
  readonly author? = computed((root: StateDefinition) =>
    root.users[this.authorId]);
}

class UserDefinition {
  readonly id = str();
  firstName = str();
  lastName = str();
  name? = computed(() => this.firstName + ' ' + this.lastName);
}

class StateDefinition {
  comments = map(obj(CommentDefinition));
  users = map(obj(UserDefinition));
  numUsers? = computed(() => this.users.length);
}

function createStore<T, U>(
  params: { stateDefinition: T, initialState: T, actions: U },
) {
  console.log(params);
  return { } as T & U;
}

let def: StateDefinition = {
  comments: {},
  users: {},
};

createStore({
  stateDefinition: StateDefinition,
  initialState: def,
  actions: {},
});
