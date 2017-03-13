/**
 * Validates a number
 * @param value The number
 */
export function prepareNumber(value) {
  if (value == undefined || typeof value === 'number') {
    return value
  } else {
    throw new Error('Bad types number')
  }
}
