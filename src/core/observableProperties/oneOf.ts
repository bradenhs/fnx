import * as core from '../../core'

export const oneOfProperty: core.Property = {
  set: (target, key, value, description: core.OneOfDescriptor, root) => {
    let setValue
    for (const kind of description.kinds) {
      let caughtError = false
      try {
        setValue = core.setProperty(target, key, value, kind, root)
      } catch (e) {
        caughtError = true
      }
      if (setValue != undefined) {
        break
      }
    }
    if (setValue == undefined) {
      throw new Error('For oneOf given value didn\'t match any oneOf kind')
    }
    return {
      didChange: false, result: setValue
    }
  },
  get: (target, key) => {
    return target[key]
  }
}
