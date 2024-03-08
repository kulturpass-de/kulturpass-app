import React from 'react'
import { Text } from 'react-native'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useTextStyles } from '../../../theme/hooks/use-text-styles'
import { useTheme } from '../../../theme/hooks/use-theme'
import { useFormattedDateTime } from '../../../utils/date/hooks/use-formatted-date-time'

export type FavoritesEventDateProps = {
  startDate?: string
  endDate?: string
}

export const FavoritesEventDate = ({ startDate, endDate }: FavoritesEventDateProps) => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()
  const { t } = useTranslation()
  const textStyles = useTextStyles()

  const formattedEventStartDate = useFormattedDateTime(startDate)
  const formattedEvenEndDate = useFormattedDateTime(endDate)

  const eventEndsOnSameDay = endDate?.split('T')[0] === startDate?.split('T')[0]

  if (
    (formattedEventStartDate && formattedEvenEndDate === undefined) ||
    (eventEndsOnSameDay && formattedEventStartDate)
  ) {
    return (
      <Text
        testID={buildTestId('favorites_item_event_start_date')}
        style={[textStyles.BodySmallRegular, { color: colors.labelColor }]}>
        {t('favorites_item_event_start_date', {
          date: formattedEventStartDate.date,
          time: formattedEventStartDate.time,
        })}
      </Text>
    )
  }

  if (!eventEndsOnSameDay && formattedEventStartDate && formattedEvenEndDate) {
    return (
      <Text
        testID={buildTestId('favorites_item_event_date')}
        style={[textStyles.BodySmallRegular, { color: colors.labelColor }]}>
        {t('favorites_item_event_date_range', {
          dateStart: formattedEventStartDate.date,
          dateEnd: formattedEvenEndDate.date,
        })}
      </Text>
    )
  }

  return null
}
