import {
  dateToDotDate,
  dateToIsoDate,
  dotDateToDate,
  dotDateToIsoDate,
  isoDateToDate,
  isoDateToDotDate,
} from './date-utils'

describe('DateFormField date utils', () => {
  test('dateToDotDate', () => {
    expect(dateToDotDate(new Date('1950-01-01'))).toBe('01.01.1950')
    expect(dateToDotDate(new Date('2000-12-01'))).toBe('01.12.2000')
    expect(dateToDotDate(new Date('2021-05-20'))).toBe('20.05.2021')
  })

  test('dateToIsoDate', () => {
    expect(dateToIsoDate(new Date('1950-01-01'))).toBe('1950-01-01')
    expect(dateToIsoDate(new Date('2000-12-01'))).toBe('2000-12-01')
    expect(dateToIsoDate(new Date('2021-05-20'))).toBe('2021-05-20')
    expect(dateToIsoDate(new Date('2014-25-23'))).toBe(undefined)
    expect(dateToIsoDate(NaN)).toBe(undefined)
    expect(dateToIsoDate(null)).toBe(undefined)
  })

  test('dotDateToDate', () => {
    expect(dotDateToDate('01.01.1950')?.getTime()).toBe(new Date('1950-01-01').getTime())
    expect(dotDateToDate('01.12.2000')?.getTime()).toBe(new Date('2000-12-01').getTime())
    expect(dotDateToDate('20.05.2021')?.getTime()).toBe(new Date('2021-05-20').getTime())

    expect(dotDateToDate('')).toBe(undefined)
    expect(dotDateToDate('abcdef')).toBe(undefined)
    expect(dotDateToDate('1950-01-01')).toBe(undefined)
    expect(dotDateToDate('01.01.95')).toBe(undefined)
    expect(dotDateToDate('30.02.2000')).toBe(undefined)
  })

  test('dotDateToIsoDate', () => {
    expect(dotDateToIsoDate('01.01.1950')).toBe('1950-01-01')
    expect(dotDateToIsoDate('01.12.2000')).toBe('2000-12-01')
    expect(dotDateToIsoDate('20.05.2021')).toBe('2021-05-20')

    expect(dotDateToIsoDate('')).toBe('')
    expect(dotDateToIsoDate('abcdef')).toBe('')
    expect(dotDateToIsoDate('1950-01-01')).toBe('')
    expect(dotDateToIsoDate('01.01.95')).toBe('')
    expect(dotDateToIsoDate('1.1.1995')).toBe('')
    expect(dotDateToIsoDate('30.02.2000')).toBe('')
  })

  test('isoDateToDate', () => {
    expect(isoDateToDate('1950-01-01')?.getTime()).toBe(new Date('1950-01-01').getTime())
    expect(isoDateToDate('2000-12-01')?.getTime()).toBe(new Date('2000-12-01').getTime())
    expect(isoDateToDate('2021-05-20')?.getTime()).toBe(new Date('2021-05-20').getTime())

    expect(isoDateToDate('')).toBe(undefined)
    expect(isoDateToDate('abcdef')).toBe(undefined)
    expect(isoDateToDate('01.01.1950')).toBe(undefined)
    expect(isoDateToDate('95-01-01')).toBe(undefined)
    expect(isoDateToDate('1995-1-1')).toBe(undefined)
    expect(isoDateToDate('2000-02-30')).toBe(undefined)
  })

  test('isoDateToDotDate', () => {
    expect(isoDateToDotDate('1950-01-01')).toBe('01.01.1950')
    expect(isoDateToDotDate('2000-12-01')).toBe('01.12.2000')
    expect(isoDateToDotDate('2021-05-20')).toBe('20.05.2021')

    expect(isoDateToDotDate('')).toBe('')
    expect(isoDateToDotDate('abcdef')).toBe('')
    expect(isoDateToDotDate('01.01.1950')).toBe('')
    expect(isoDateToDotDate('95-01-01')).toBe('')
    expect(isoDateToDotDate('1995-1-1')).toBe('')
    expect(isoDateToDotDate('2000-02-30')).toBe('')
  })
})
