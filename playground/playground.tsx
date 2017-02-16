import * as React from 'react';
import * as ReactDOM from 'react-dom';
import fnx, { ReactiveComponent } from '../src/fnx';
import * as actions from './actions';

export interface IState {
  counter: number;
  readonly countPlusOne: number;
}

const initialState: IState = {
  counter: 0,
  get countPlusOne(this: IState) {
    return this.counter + 1;
  },
};

const state = fnx.observable(initialState, { ...actions });

const Counter = ReactiveComponent.create(() =>
  <div onClick={ state.$increment }>
    { state.counter }
    { state.countPlusOne }
  </div>,
);

ReactDOM.render(<Counter/>, document.querySelector('#app'));

// fnx-babel-react-webpack-starter
// fnx-typescript-react-webpack-starter
// recommended-starter
