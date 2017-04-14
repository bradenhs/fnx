export class ObjectKeyWeakMap<K extends object, V> {
  private weakMap: WeakMap<K, { [key: string]: V }> = new WeakMap()

  get(object: K, key: string): V {
    const container = this.weakMap.get(object)
    return container == null ? null : container[key]
  }

  has(object: K, key: string) {
    return this.weakMap.has(object) && this.weakMap.get(object).hasOwnProperty(key)
  }

  set(object: K, key: string, value: V) {
    if (this.weakMap.get(object) == null) {
      this.weakMap.set(object, {})
    }
    const container = this.weakMap.get(object)
    container[key] = value
    return true
  }
}
