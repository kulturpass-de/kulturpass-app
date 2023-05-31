import { renderHook } from '@testing-library/react-native'

import { translation } from '../../../services/translation/translation'
import { useFormattedDateTime } from './use-formatted-date-time'

describe('useFormattedDateTime', () => {
  beforeEach(() => {
    translation.changeLanguage('de')
  })

  test('Should return formatted Date and Time', () => {
    const dateTimeAsString = '1985-05-14T11:00:00+0000' // TODO
    const { result } = renderHook(() => useFormattedDateTime(dateTimeAsString))

    expect(result.current).toBeDefined()
    expect(result.current!.date).toMatch('14.05.1985')
    expect(result.current!.l).toMatch('de')
  })

  test('Should return undefined', () => {
    const { result } = renderHook(() => useFormattedDateTime(undefined))
    expect(result.current).toBeUndefined()
  })
})
