export const lastDigitOfString = (value?: string) => {
  return parseInt(value?.replace(/.*(\d)[^\d]*$/i, '$1') || '0', 10)
}

export const getBackgdropIndex = (baseTenIndex: number, returnedMaxIndex: number) => {
  return Math.floor((baseTenIndex * returnedMaxIndex) / 10)
}
