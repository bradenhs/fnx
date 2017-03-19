import * as React from 'react'
import * as core from '../core'
import { extend } from '../utils'

export interface ReactiveComponent<P, S> extends React.PureComponent<P, S> {
  componentWillReact?(): void
}

export interface ReactiveComponentType {
  <T>(statelessComponent: T): T
  new <P, S>(props: P, context?: any): ReactiveComponent<P, S>
}

const ReactiveComponent: ReactiveComponentType = (function(this: any) {
  if (new.target == undefined) {
    const render = arguments[0]
    return class extends ReactiveComponent<{}, {}> {
      public render(this: any) { // tslint:disable-line
        return render(this.props)
      }
    }
  }

  React.Component.call(this, ...arguments)

  const reaction = core.registerReaction(
    this.render.bind(this),
    () => {
      if (typeof this.componentWillReact === 'function') {
        this.componentWillReact()
      }
      this.forceUpdate()
    },
  )

  this.render = () => {
    const lastActiveReaction = core.getActiveReaction()
    const result = core.invokeReaction(reaction)
    core.setActiveReactionId(lastActiveReaction.id)
    return result
  }

  const originalComponentWillUnmount = this.componentWillUnmount

  this.componentWillUnmount = () => {
    if (typeof originalComponentWillUnmount === 'function') {
      originalComponentWillUnmount()
    }
    core.disposeReaction(reaction.id)
  }

}) as any as ReactiveComponentType

extend(ReactiveComponent, React.PureComponent)

export default ReactiveComponent
