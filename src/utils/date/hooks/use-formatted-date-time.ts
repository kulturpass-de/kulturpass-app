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

    /**
     * In the following two DateTimeFormat, we want to display the dates in the dd.mm.yyyy format, no matter what the
     * currently selected language is
     */

    const dateFormat = new Intl.DateTimeFormat(Language.de, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })

    const timeFormat = new Intl.DateTimeFormat(Language.de, {
      hour: '2-digit',
      minute: '2-digit',
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
