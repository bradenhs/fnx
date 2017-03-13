export function prepareString(value) {
  if (value == undefined || typeof value === 'string') {
    return value
  } else {
    throw new Error('Bad types string')
  }
}
