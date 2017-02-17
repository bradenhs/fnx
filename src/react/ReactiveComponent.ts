import * as React from 'react';
import * as isEqual from 'lodash.isequal';
import {
  registerReaction, getActiveReactionId, invokeReaction, setActiveReactionId,
  disposeReaction,
} from '../core';

export interface ReactiveComponentLifecycle {
  componentWillReact?(): void;
}

/**
 * Awesome
 */
export abstract class ReactiveComponent<P, S>
  extends React.Component<P, S> implements ReactiveComponentLifecycle {
  public constructor() {
    super();

    const reactionId = registerReaction(
      this.render.bind(this),
      () => {
        if (typeof (this as any).componentWillReact === 'function') {
          (this as any).componentWillReact();
        }
        this.forceUpdate();
      },
    );
    this.render = () => {
      const lastActiveReactionId = getActiveReactionId();
      const result = invokeReaction(reactionId) as JSX.Element;
      setActiveReactionId(lastActiveReactionId);
      return result;
    };

    const originalComponentWillUnmount = (this as any).componentWillUnmount;
    (this as any).componentWillUnmount = () => {
      if (typeof originalComponentWillUnmount === 'function') {
        originalComponentWillUnmount();
      }
      disposeReaction(reactionId);
    };
  }

  public shouldComponentUpdate(nextProps: P, nextState: S) {
    return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState);
  }

  public static create<T extends (...args: any[]) => JSX.Element>(render: T) {
    return class extends ReactiveComponent<{}, {}> {
      public render() {
        return render(this.props);
      }
    } as any as T;
  }
}
