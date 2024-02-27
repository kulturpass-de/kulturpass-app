import { Language } from '../../services/translation/types'

export const dateFormat = { day: '2-digit', month: '2-digit', year: 'numeric' } as const

export const formatFullDateTime = (date: number | Date) => {
  return new Intl.DateTimeFormat(Language.de, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}
export const formatFullDate = (date: number | Date) => {
  const formattedDate = new Intl.DateTimeFormat(Language.de, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
  return formattedDate.replace(/\//g, '.')
}
