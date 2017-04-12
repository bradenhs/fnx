import * as core from '../core'

export type Next = () => {
  diff: core.Diff[],
  returnValue: any
}

const middlewareCollectionsByObservable = new WeakMap<object, Middleware[]>()

export type ActionInfo = {
  args: any[]
  path: string[]
}

export type Disposable = {
  remove: () => void
}

export type Middleware = {
  (next: Next, action: ActionInfo): void
}

function getMiddlewares(observable: object) {
  let middlewares: Middleware[] = []
  let node = observable
  do {
    middlewares = [].concat(middlewareCollectionsByObservable.get(node) || [], middlewares)
    node = core.getParent(node)
  } while (node != null)
  return middlewares
}

export function executeMiddlewareAroundAction(
  observable: object, runAction: Function, action: core.ActionInfo
) {
  const nextFuncs: Next[] = [ ]
  let returnValue
  getMiddlewares(observable).forEach((middleware, index) => {
    let runs = 0
    nextFuncs.push(() => {
      runs++
      if (runs > 1) {
        throw new Error('next function may only be called zero or one times`')
      }
      middleware(nextFuncs[index + 1], action)
      return {
        returnValue,
        diff: core.getDiff()
      }
    })
  })
  let actionRuns = 0
  nextFuncs.push(() => {
    actionRuns++
    if (actionRuns > 1) {
      throw new Error('next function may only be called zero or one times`')
    }
    core.clearDiff()
    returnValue = runAction()
    return {
      returnValue,
      diff: core.getDiff()
    }
  })
  nextFuncs[0]()
  return returnValue
}

export function use(observable: object, middleware: Middleware): Disposable {
  if (!middlewareCollectionsByObservable.has(observable)) {
    middlewareCollectionsByObservable.set(observable, [ middleware ])
  } else {
    middlewareCollectionsByObservable.get(observable).push(middleware)
  }
  return {
    remove() {
      const middlewareCollection = middlewareCollectionsByObservable.get(observable)
      const index = middlewareCollection.indexOf(middleware)
      middlewareCollection.splice(index, 1)
    }
  }
}
