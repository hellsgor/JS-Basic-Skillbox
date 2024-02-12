export function pudZero(value) {
  return `${value}`.length < 2 ? `0${value}` : `${value}`
}
