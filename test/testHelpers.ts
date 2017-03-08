export function catchErrType(fn: Function) {
  try {
    fn()
  } catch (e) {
    return e.constructor
  }
}
