export function catchErrType(fn: Function) {
  try {
    fn()
  } catch (e) {
    return e.constructor
  }
}

export function sleep(milliseconds: number) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds)
  })
}
