export function transaction(fn: () => void) {
  fn()
}
