import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { colors } from '../../theme/colors'
import { textStyles } from '../../theme/typography'
import { useFormattedDateTime } from '../../utils/date/hooks/use-formatted-date-time'

export type FavoritesEventDateProps = {
  startDate?: string
  endDate?: string
}

export const FavoritesEventDate = ({ startDate, endDate }: FavoritesEventDateProps) => {
  const { buildTestId } = useTestIdBuilder()
  const { t } = useTranslation()

  const formattedEventStartDate = useFormattedDateTime(startDate)
  const formattedEvenEndDate = useFormattedDateTime(endDate)

  const eventEndsOnSameDay = endDate?.split('T')[0] === startDate?.split('T')[0]

  if (eventEndsOnSameDay && formattedEventStartDate) {
    return (
      <Text numberOfLines={1} testID={buildTestId('favorites_item_event_start_date')} style={styles.informationToken}>
        {t('favorites_item_event_start_date', {
          date: formattedEventStartDate.date,
          time: formattedEventStartDate.time,
        })}
      </Text>
    )
  }

  if (!eventEndsOnSameDay && formattedEventStartDate && formattedEvenEndDate) {
    return (
      <Text numberOfLines={1} testID={buildTestId('favorites_item_event_date')} style={styles.informationToken}>
        {t('favorites_item_event_date_range', {
          dateStart: formattedEventStartDate.date,
          dateEnd: formattedEvenEndDate.date,
        })}
      </Text>
    )
  }

  return null
}

const styles = StyleSheet.create({
  informationToken: {
    ...textStyles.BodySmallRegular,
    color: colors.moonDarkest,
  },
})
