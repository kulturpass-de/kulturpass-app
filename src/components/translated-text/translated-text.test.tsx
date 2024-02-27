import { render, screen } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'
import { buildTestId } from '../../services/test-id/test-id'
import { translation } from '../../services/translation/translation'
import { formatFullDate } from '../../utils/date/date-format'
import { TranslatedText } from './translated-text'

test('Should format date in german format', async () => {
  const reservationDate = new Date('2023-05-30T00:00:00Z')

  translation?.changeLanguage('de')

  render(
    <Text testID={buildTestId('reservationDetail_statusInfo_reservationDate_label')}>
      <TranslatedText
        i18nKey="reservationDetail_statusInfo_reservationDate_label"
        i18nParams={{ reservationDate, formatParams: { reservationDate: formatFullDate(reservationDate) } }}
        testID={buildTestId('reservationDetail_statusInfo_reservationDate_label')}
        textStyle="CaptionSemibold"
      />
      {formatFullDate(reservationDate)}
    </Text>,
  )

  expect(await screen.findByText(/30.05.2023/)).toBeOnTheScreen()
})

test('Should format date in english format', async () => {
  const reservationDate = new Date('2023-05-30T00:00:00Z')

  translation?.changeLanguage('en')

  render(
    <Text testID={buildTestId('reservationDetail_statusInfo_reservationDate_label')}>
      <TranslatedText
        i18nKey="reservationDetail_statusInfo_reservationDate_label"
        i18nParams={{ reservationDate, formatParams: { reservationDate: formatFullDate(reservationDate) } }}
        testID={buildTestId('reservationDetail_statusInfo_reservationDate_label')}
        textStyle="CaptionSemibold"
      />
      {formatFullDate(reservationDate)}
    </Text>,
  )

  expect(await screen.findByText(/30.05.2023/)).toBeOnTheScreen()
})
