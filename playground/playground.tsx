import * as React from 'react';
import * as ReactDOM from 'react-dom';
import fnx from '../src/fnx';

import ReactiveComponent from '../src/extras/react';

export interface IState {
  num: number;
}

const initialState: IState = {
  num: 0
};

const actions = {
  $increment(this: IState) {
    this.num++;
  }
};

const state = fnx.observable(initialState, actions);

console.log(state);

const Num = ReactiveComponent(() => {
  return <div>
    { state.num }
  </div>;
});

class Counter extends ReactiveComponent<{}, {}> {
  public render() {
    return <div onClick={ state.$increment }>
      <Num/>
    </div>;
  }

  public componentWillReact() {
    console.log('component will react');
  }
};

ReactDOM.render(<Counter />, document.querySelector('#app'));

// fnx-babel-react-webpack-starter
// fnx-typescript-react-webpack-starter
// recommended-starter

// interceptors: [ {
//   condition: v => v instanceof Date,
//   serialize: (v: Date) => v.valueOf(),
//   deserialize: (v: number) => new Date(v),
// } ]

// set store unserialized for gets, serialize, compare, do reactions if needed

// fnx.configure({
//   interceptors: [
//     {
//       condition: v => typeof v === 'object' && v.constructor === Date,
//       serialize: (obj: Date) => obj.valueOf(),
//       deserialize: (value: number) => new Date(value),
//     }
//   ]
// });

// serialize()

// if (object.constructor === Date) {
//   return object.valueOf();
// }

// this is the type for an object that new Hello() creates
