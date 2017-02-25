const identifiers = {
  // Non-serializable types
  computed: Symbol('computed'),
  action: Symbol('action'),

  // Serializable Types
  // string: Symbol('string'),
  // boolean: Symbol('boolean'),
  // number: Symbol('number'),
  // complex: Symbol('complex'),
  // object: Symbol('object'),
  // arrayOf: Symbol('array of'),
  // mapOf: Symbol('map of'),
  // oneOf: Symbol('one of'),
};

const modifiers = { readonly: false, optional: false };

// Mask types for consumption
const string = { type: identifiers.string, modifiers } as any as string;
const boolean = { type: identifiers.boolean, modifiers } as any as boolean;
const number = { type: identifiers.number, modifiers } as any as number;

function complex<ComplexType, SimpleType extends (number | string | boolean)>(
  serialize: (complexValue: ComplexType) => SimpleType,
  deserialize: (simpleValue: SimpleType) => ComplexType,
) {
  return { type: identifiers.complex, modifiers, serializers: { serialize, deserialize } } as any as ComplexType;
};

function object<T>(object: new (initialState?: any) => T) {
  return { type: identifiers.object, modifiers, object: new object() } as any as T;
}

function arrayOf<T>(item: T) {
  return { type: identifiers.arrayOf, modifiers, item } as any as T[];
}

function mapOf<T>(item: T) {
  return { type: identifiers.mapOf, modifiers, item } as any as {
    [key: string]: T;
    [key: number]: T;
  }
}

function oneOf<A, B>(a: A, b: B): A | B;
function oneOf<A, B, C>(a: A, b: B, c: C): A | B | C;
function oneOf<A, B, C, D>(a: A, b: B, c: C, d: D): A | B | C | D;
function oneOf<A, B, C, D, E>(a: A, b: B, c: C, d: D, e: E): A | B | C | D | E;
function oneOf<A, B, C, D, E, F>(a: A, b: B, c: C, d: D, e: E, f: F): A | B | C | D | E | F;
function oneOf<A, B, C, D, E, F, G>(a: A, b: B, c: C, d: D, e: E, f: F, g: G): A | B | C | D | E | F | G;
function oneOf<A, B, C, D, E, F, G, H>(a: A, b: B, c: C, d: D, e: E, f: F, g: G, H): A | B | C | D | E | F | G | H;
function oneOf(...items: any[]): any;
function oneOf(...items: any[]) {
  return { type: identifiers.oneOf, modifiers, items };
}

function action<T>(action: T & ((...args: any[]) => void)) {
  return { type: identifiers.action, action } as any as T;
}

function derivation<T>(getter: () => T) {
  return { type: identifiers.computed, getter } as any as T;
}

function readonly(target: any, propertyKey: string) {
  target[propertyKey].modifiers.readonly = true;
}

function optional(target: any, propertyKey: string) {
  target[propertyKey].modifiers.optional = true;
}

abstract class Observable<StateTreeRoot> {
  constructor(initialState: StateTreeRoot) {
    console.log(initialState);
  }

  protected getRoot?(): StateTreeRoot {
    return undefined;
  }
}

class User extends Observable<State> {
  @readonly readonly id = string;
  firstName = string;
  @optional lastName? = string;
  dateOfBirth = complex((d: Date) => d.toUTCString(), v => new Date(v));
  fullName? = derivation(() => this.firstName + ' ' + this.lastName);
  changeName? = action((firstName: string) => {
    this.firstName = firstName;
  });
}

class Message extends Observable<State> {
  @readonly readonly id = string;
  authorId = string;
  author? = derivation(() => this.getRoot().users[this.authorId])
}

class State extends Observable<State> {
  @readonly readonly users = mapOf(object(User));
  @readonly readonly messages = mapOf(object(Message));
  version = number;

  @derivation
  get

  @action
  goAway() {

  }
}

class State {
  users = mapOf(object(User));
  messages = mapOf(object(Message));
}

const State = {
  users: mapOf(object(User)),
  messages: mapOf(object(Message)),
  version: number,
  fullName: derivation(() => this.firstName + ' ' + this.lastName),
}

const state = createState(State, )

const state = new State({
  users: {},
  messages: {},
  version: 0,
});

// replaceState(state, JSON.stringify(state));

// Observable
// string
// boolean
// number
// mapOf
// object
// derivation
// action
// complex
// oneOf
// arrayOf
// @readonly
// @optional
// replaceState
// reaction
// configure
// ReactiveComponent
// transaction
