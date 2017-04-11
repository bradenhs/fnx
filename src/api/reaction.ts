import * as core from '../core'

/**
 * Initializes a reaction. The function passed in is invoked immediately and then again anytime any
 * observable property accessed in the function's last execution is mutated.
 * https://fnx.js.org/docs/api/reaction.html
 * @param fn The function to run when this reaction is triggered
 */
export function reaction(fn: () => void) {
  const reaction = core.registerReaction(fn)
  core.invokeReaction(reaction)

  return {
    remove() {
      core.removeReaction(reaction.id)
    }
  }
}
