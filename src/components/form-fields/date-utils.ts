export const dateToDotDate = (date: Date) => {
  const isoDate = dateToIsoDate(date)

  if (isoDate) {
    const [yyyy, mm, dd] = isoDate.split('-')
    return `${dd}.${mm}.${yyyy}`
  }
}

export const dateToIsoDate = (date: Date | number | null) => {
  if (!isNaN(date as number) && date instanceof Date) {
    return date?.toISOString().replace(/T.*$/, '')
  }
}

export const isoDateToDate = (isoDate?: string) => {
  if (isoDate) {
    const dateParse = Date.parse(isoDate)

    if (dateParse) {
      const date = new Date(dateParse)
      if (dateToIsoDate(date) === isoDate) {
        return date
      }
    }
  }
}

export const dotDateToDate = (dotDate: string) => {
  const [dd, mm, yyyy] = dotDate.split('.')
  const dateParse = Date.parse(`${yyyy}-${mm}-${dd}`)

  if (dateParse) {
    const date = new Date(dateParse)
    if (dateToDotDate(date) === dotDate) {
      return date
    }
  }
}

export const isoDateToDotDate = (isoDate?: string) => {
  if (isoDate) {
    const date = isoDateToDate(isoDate)
    if (date) {
      return dateToDotDate(date)
    }
  }

  return ''
}

export const dotDateToIsoDate = (dotDate?: string) => {
  if (dotDate) {
    const date = dotDateToDate(dotDate)
    if (date) {
      return dateToIsoDate(date)
    }
  }

  return ''
}
