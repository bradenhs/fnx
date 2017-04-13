import * as React from 'react'
import { _interalUseOnlyCore as core } from '../fnx'

if (React == null) {
  throw new Error(
    'FNX ReactiveComponent Error: Missing Depedency - React (make sure the react script tag is ' +
    'included before the ReactiveComponent script tag)'
  )
}

if (core == null) {
  throw new Error(
    'FNX ReactiveComponent Error: Missing Depedency - fnx (make sure the fnx script tag is ' +
    'included before the ReactiveComponent script tag)'
  )
}

export interface ReactiveComponent<P, S> extends React.PureComponent<P, S> {
  componentWillReact?(): void
}

export interface ReactiveComponentType {
  <T>(statelessComponent: T): T
  new <P, S>(props: P, context?: any): ReactiveComponent<P, S>
}

const ReactiveComponent = class extends React.PureComponent<{}, {}> {
  constructor(props, context) {
    if (typeof arguments[0] === 'function') {
      const render = arguments[0]
      return class extends ReactiveComponent<{}, {}> {
        public render(this: any) {
          return render(this.props)
        }
      } as any
    }

    super(props, context)

    const self: any = this

    if (self.render != null) {
      const reaction = core.registerReaction(
        self.render.bind(self),
        () => {
          if (typeof self.componentWillReact === 'function') {
            self.componentWillReact()
          }
          self.forceUpdate()
        },
      )

      self.render = () => {
        const lastActiveReaction = core.getActiveReaction()
        const result = core.invokeReaction(reaction)
        core.setActiveReactionId(lastActiveReaction && lastActiveReaction.id)
        return result
      }

      const originalComponentWillUnmount = self.componentWillUnmount

      self.componentWillUnmount = () => {
        if (typeof originalComponentWillUnmount === 'function') {
          originalComponentWillUnmount()
        }
        core.removeReaction(reaction.id)
      }
    }
  }
} as any as ReactiveComponentType

export default ReactiveComponent
