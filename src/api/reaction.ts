import * as core from '../core'

/**
 * TODO
 */
export function reaction(fn: () => void) {
  const reactionId = core.registerReaction(fn)
  core.invokeReaction(reactionId)

  return {
    dispose() {
      core.disposeReaction(reactionId)
    }
  }
}
