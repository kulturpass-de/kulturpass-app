import React from 'react'
import { StyleSheet, View } from 'react-native'
import { TestId } from '../../services/test-id/test-id'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import { TranslatedText } from '../translated-text/translated-text'
import { AvailableTranslations } from '../translated-text/types'

export type BadgeProps = {
  i18nKey: AvailableTranslations
  i18nParams?: {}
  testID?: TestId
}

export const Badge: React.FC<BadgeProps> = ({ i18nKey, i18nParams, testID }) => {
  const { colors } = useTheme()
  return (
    <View style={[styles.badge, { backgroundColor: colors.badgeBackground }]} testID={testID}>
      <TranslatedText
        i18nKey={i18nKey}
        i18nParams={i18nParams}
        textStyle="BodyPrimary1Dark"
        textStyleOverrides={{ color: colors.labelColor }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 100,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[1],
    alignSelf: 'flex-start',
  },
})
