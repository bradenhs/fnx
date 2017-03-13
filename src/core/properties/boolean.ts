/**
 * Validates a boolean
 * @param value The boolean
 */
export function prepareBoolean(value) {
  if (value == undefined || typeof value === 'boolean') {
    return value
  } else {
    throw new Error('Bad types boolean')
  }
}
