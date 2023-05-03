import React from 'react'
import { View, Pressable, StyleSheet, PressableProps } from 'react-native'
import { TestId, useTestIdBuilder } from '../../services/test-id/test-id'

import { useTranslation } from '../../services/translation/translation'
import { colors } from '../../theme/colors'
import { Icon } from '../icon/icon'
import { TranslatedText } from '../translated-text/translated-text'
import { AvailableTranslations } from '../translated-text/types'
import { spacing } from '../../theme/spacing'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    height: 56,
    backgroundColor: colors.basicWhite,
  },
  titleContainer: { marginLeft: 6 },
  closeButton: { marginRight: 6 },
})

export type ModalScreenHeaderProps = {
  testID: TestId
  titleI18nKey: AvailableTranslations
  onPressBack?: PressableProps['onPress']
  onPressClose?: PressableProps['onPress']
}

export const ModalScreenHeader: React.FC<ModalScreenHeaderProps> = ({
  testID,
  titleI18nKey,
  onPressBack,
  onPressClose,
}) => {
  const { t } = useTranslation()
  const { addTestIdModifier } = useTestIdBuilder()

  return (
    <View style={styles.container} testID={testID}>
      {onPressBack && (
        <Pressable
          onPress={onPressBack}
          testID={addTestIdModifier(testID, 'backButton')}
          accessibilityLabel={t('back_button')}
          accessible>
          <Icon source="ArrowBack" width={24} height={24} />
        </Pressable>
      )}
      <View style={styles.titleContainer}>
        <TranslatedText
          testID={addTestIdModifier(testID, 'title')}
          i18nKey={titleI18nKey}
          textStyle="SubtitleExtrabold"
          textStyleOverrides={{ color: colors.moonDarkest }}
        />
      </View>
      {onPressClose && (
        <Pressable
          style={styles.closeButton}
          onPress={onPressClose}
          testID={addTestIdModifier(testID, 'closeButton')}
          accessibilityLabel={t('close_button')}
          accessible>
          <Icon source="Close" width={24} height={24} />
        </Pressable>
      )}
    </View>
  )
}
