import { currentTimestampSecondsAsString } from './current-timestamp-seconds-as-string'

describe('current-timestamp-seconds-as-string', () => {
  it('should return the current timestamp as string', () => {
    jest.useFakeTimers('modern')

    jest.setSystemTime(new Date(1577833200 * 1000))
    expect(currentTimestampSecondsAsString()).toBe('1577833200')

    jest.setSystemTime(new Date(946594800 * 1000))
    expect(currentTimestampSecondsAsString()).toBe('946594800')

    jest.useRealTimers()
  })
})
