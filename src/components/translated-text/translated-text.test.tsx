import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { translation } from '../../services/translation/translation'
import { dateFormat } from '../../utils/date/date-format'
import { TranslatedText } from './translated-text'

test('Should format date in german format', async () => {
  const reservationDate = new Date('2023-05-30T00:00:00Z')

  translation.changeLanguage('de')

  render(
    <TranslatedText
      i18nKey="reservationDetail_statusInfo_reservationDate_label"
      i18nParams={{ reservationDate, formatParams: { reservationDate: dateFormat } }}
      textStyle="BodyBold"
    />,
  )

  expect(await screen.findByText(/30.05.2023/)).toBeOnTheScreen()
})

test('Should format date in english format', async () => {
  const reservationDate = new Date('2023-05-30T00:00:00Z')

  translation.changeLanguage('en')

  render(
    <TranslatedText
      i18nKey="reservationDetail_statusInfo_reservationDate_label"
      i18nParams={{
        reservationDate,
        formatParams: { reservationDate: dateFormat },
      }}
      textStyle="BodyBold"
    />,
  )

  expect(await screen.findByText(/05\/30\/2023/)).toBeOnTheScreen()
})
