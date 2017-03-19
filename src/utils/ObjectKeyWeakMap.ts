export class ObjectKeyWeakMap<K extends object, V> {
  private weakMap: WeakMap<K, { [key: string]: V }> = new WeakMap()

  get(object: K, key: PropertyKey): V {
    const container = this.weakMap.get(object)
    return container == undefined ? undefined : container[key]
  }

  has(object: K, key: PropertyKey) {
    return this.weakMap.has(object) && this.weakMap.get(object).hasOwnProperty(key)
  }

  set(object: K, key: PropertyKey, value: V) {
    if (this.weakMap.get(object) == undefined) {
      this.weakMap.set(object, {})
    }
    const container = this.weakMap.get(object)
    container[key] = value
    return true
  }
}
