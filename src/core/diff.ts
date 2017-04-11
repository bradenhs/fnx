export type Diff = {
  path: string[]
  from: JSONValue
  to: JSONValue
}

export type JSONValue = string | number | boolean | JSONObject | JSONArray

export interface JSONObject {
  [key: string]: JSONValue
}

export interface JSONArray extends Array<JSONValue> { }

export function applyDiffs(observable: object, diffs: Diff[]) {
  console.log(observable, diffs)
  throw new Error('Apply Diffs is not yet implemented')
}

export function clearDiff() {
}

export function getDiff(): Diff[] {
  return []
}
