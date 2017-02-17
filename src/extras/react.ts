import * as React from 'react';
import { extend } from '../utils';
import * as isEqual from 'lodash.isequal';
import {
  registerReaction, getActiveReactionId, invokeReaction, setActiveReactionId,
  disposeReaction
} from '../core';

export interface ReactiveComponent<P, S> extends React.Component<P, S> {
  componentWillReact?(): void;
}

export interface ReactiveComponentType {
  <T>(statelessComponent: T): T;
  new <P, S>(props: P, context?: any): ReactiveComponent<P, S>;
}

const ReactiveComponent: ReactiveComponentType = (function(this: any) {
  if (new.target == undefined) {
    const render = arguments[0];
    return class extends ReactiveComponent<{}, {}> {
      public render(this: any) { // tslint:disable-line
        return render(this.props);
      }
    };
  }

  React.Component.call(this, ...arguments);

  const reactionId = registerReaction(
    this.render.bind(this),
    () => {
      if (typeof this.componentWillReact === 'function') {
        this.componentWillReact();
      }
      this.forceUpdate();
    }
  );

  this.render = () => {
    const lastActiveReactionId = getActiveReactionId();
    const result = invokeReaction(reactionId);
    setActiveReactionId(lastActiveReactionId);
    return result;
  };

  const originalComponentWillUnmount = this.componentWillUnmount;

  this.componentWillUnmount = () => {
    if (typeof originalComponentWillUnmount === 'function') {
      originalComponentWillUnmount();
    }
    disposeReaction(reactionId);
  };

}) as any as ReactiveComponentType;

ReactiveComponent.prototype.shouldComponentUpdate =
  function(this: any, nextProps: any, nextState: any) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  };

extend(ReactiveComponent, React.Component);

export default ReactiveComponent;
