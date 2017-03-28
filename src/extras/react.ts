import * as React from 'react'
import * as core from '../core'

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

    if (self.render != undefined) {
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
        core.disposeReaction(reaction.id)
      }
    }
  }
} as any as ReactiveComponentType

export default ReactiveComponent
