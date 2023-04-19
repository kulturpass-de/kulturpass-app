export const parseJsonIfValid = (jsonStr: string | null): any => {
  if (typeof jsonStr !== 'string') {
    return jsonStr
  }

  try {
    const jsonResult = JSON.parse(jsonStr)
    return jsonResult
  } catch (error: unknown) {
    // if the stored values is not a valid json object,
    // the following error will be thrown which
    // needs to be ignored. just return the actual value then
    if (!(error instanceof SyntaxError)) {
      throw error
    }
  }

  return jsonStr
}

export const stringify = (value: null | undefined | string | number | Object): string => {
  let newValue: string
  if (value === null || value === undefined) {
    newValue = ''
  } else {
    if (typeof value === 'string') {
      newValue = value
    } else {
      newValue = JSON.stringify(value)
    }
  }
  return newValue
}
