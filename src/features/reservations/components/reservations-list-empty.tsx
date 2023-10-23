import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Illustration, IllustrationType } from '../../../components/illustration/illustration'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { TestId, useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'

export type ReservationsListEmptyProps = {
  testID: TestId
  i18nTitleKey: AvailableTranslations
  i18nContentKey: AvailableTranslations
  i18nIllustrationAltKey: AvailableTranslations
  illustrationType: IllustrationType
}

export const ReservationsListEmpty: React.FC<ReservationsListEmptyProps> = ({
  testID,
  i18nTitleKey,
  i18nContentKey,
  i18nIllustrationAltKey,
  illustrationType,
}) => {
  const { addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()

  return (
    <View style={styles.container} testID={testID}>
      <Illustration
        testID={addTestIdModifier(testID, 'image')}
        i18nKey={i18nIllustrationAltKey}
        type={illustrationType}
      />
      <View style={styles.textContainer}>
        <TranslatedText
          testID={addTestIdModifier(testID, 'title')}
          textStyle="HeadlineH4Extrabold"
          textStyleOverrides={[styles.noItemsTitle, { color: colors.labelColor }]}
          i18nKey={i18nTitleKey}
        />
        <TranslatedText
          testID={addTestIdModifier(testID, 'content')}
          textStyle="BodyRegular"
          textStyleOverrides={[styles.noItemsContent, { color: colors.labelColor }]}
          i18nKey={i18nContentKey}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flexGrow: 1,
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: spacing[6],
  },
  noItemsTitle: {
    textAlign: 'center',
  },
  noItemsContent: {
    paddingTop: spacing[2],
    textAlign: 'center',
  },
})
