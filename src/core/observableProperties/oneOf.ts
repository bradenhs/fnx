import * as core from '../../core'

export const oneOfProperty: core.Property = {
  set: (target, key, value, description: core.OneOfDescriptor, root, parentObservable, path) => {
    let setValue
    for (const kind of description.kinds) {
      let caughtError = false
      try {
        setValue = core.setProperty(target, key, value, kind, root, parentObservable, path)
      } catch (e) {
        caughtError = true
      }
      if (setValue != null) {
        break
      }
    }
    if (setValue == null) {
      throw new Error('For oneOf given value didn\'t match any oneOf kind')
    }
    // Did change as false because the above setProperty would already have triggered that
    return {
      didChange: false, result: setValue
    }
  },
  get: (target, key) => {
    return target[key]
  }
}
