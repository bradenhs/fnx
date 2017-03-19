import * as core from '../core'

/**
 * TODO
 */
export function reaction(fn: () => void) {
  const reaction = core.registerReaction(fn)
  core.invokeReaction(reaction)

  return {
    dispose() {
      core.disposeReaction(reaction.id)
    }
  }
}
