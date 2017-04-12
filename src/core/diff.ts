import * as core from '../core'

export type Diff = {
  path: string[]
  from?: JSONValue
  to?: JSONValue
}

export type JSONValue = string | number | boolean | JSONObject | JSONArray

export interface JSONObject {
  [key: string]: JSONValue
}

export interface JSONArray extends Array<JSONValue> { }

export function applyDiffs(observable: object, diffs: Diff[]) {
  core.setIsApplyingSnapshotFromJSON(true)
  diffs.forEach(diff => {
    let node = observable
    const key = diff.path[diff.path.length - 1]
    for (let i = 0; i < diff.path.length - 1; i++) {
      node = node[diff.path[i]]
    }
    if (diff.to === undefined) {
      delete node[key]
    } else {
      node[key] = JSON.parse(JSON.stringify(diff.to))
    }
  })
  core.setIsApplyingSnapshotFromJSON(false)
}

let diff: Diff[] = []

export function clearDiff() {
  diff = []
}

export function getDiff(): Diff[] {
  return diff
}

let isCapturingCounter = 0
let startValue

export function startDiffCapture(parent: object, key: string) {
  if (isCapturingCounter === 0) {
    startValue = snapshot(parent, key)
  }
  isCapturingCounter++
}

export function endDiffCapture(parent: object, key: string, didChange: boolean, path: string[]) {
  isCapturingCounter--
  if (isCapturingCounter === 0) {
    const endValue = snapshot(parent, key)
    recordDiff(startValue, endValue, path, didChange)
  }
}

export function recordDiff(from: JSONValue, to: JSONValue, path: string[], didChange?: boolean) {
  if (isCapturingCounter === 0 && didChange && JSON.stringify(to) !== JSON.stringify(from)) {
    if (from === undefined) {
      diff.push({
        path, to
      })
    } else if (to === undefined) {
      diff.push({
        path, from
      })
    } else {
      diff.push({
        path, from, to
      })
    }
  }
}

function snapshot(target, key) {
  core.incrementSnapshotAsJSON()
  let value = target[key]
  if (value != null && typeof value === 'object' && core.isObservable(value)) {
    value = value.getSnapshot({ asJSON: true })
  }
  core.decrementSnapshotAsJSON()
  return value
}
