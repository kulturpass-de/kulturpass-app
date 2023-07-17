import { useMemo } from 'react'
import { useTranslation } from '../../../services/translation/translation'
import { Language } from '../../../services/translation/types'

export type FormattedDateTime = {
  dateTime: number
  l: Language
  date: string
  time: string
}

export const useFormattedDateTime = (dateTimeAsString?: string): FormattedDateTime | undefined => {
  const { l } = useTranslation()

  const formattedDateTime: FormattedDateTime | undefined = useMemo(() => {
    if (!dateTimeAsString?.trim()) {
      return undefined
    }

    const dateTime = Date.parse(dateTimeAsString)

    const dateFormat = new Intl.DateTimeFormat(l, {
      dateStyle: 'medium',
    })

    const timeLocale = l === Language.en ? 'en-GB' : l
    const timeFormat = new Intl.DateTimeFormat(timeLocale, {
      timeStyle: 'short',
    })

    return {
      dateTime,
      l,
      date: dateFormat.format(dateTime),
      time: timeFormat.format(dateTime),
    }
  }, [l, dateTimeAsString])

  return formattedDateTime
}
