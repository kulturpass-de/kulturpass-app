import React from 'react'
import { View, Pressable, StyleSheet, PressableProps } from 'react-native'
import { TestId, useTestIdBuilder } from '../../services/test-id/test-id'

import { useTranslation } from '../../services/translation/translation'
import { colors } from '../../theme/colors'
import { Icon } from '../icon/icon'
import { TranslatedText } from '../translated-text/translated-text'
import { AvailableTranslations } from '../translated-text/types'
import { spacing } from '../../theme/spacing'
import { HITSLOP } from '../../theme/constants'
import { useFocusEffect } from '@react-navigation/native'
import useAccessibilityFocus from '../../navigation/a11y/use-accessibility-focus'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[3],
    minHeight: 56,
    backgroundColor: colors.basicWhite,
  },
  titleContainer: { paddingHorizontal: 6, flexDirection: 'row', flexShrink: 1 },
  closeButton: { marginRight: 6, flexShrink: 0 },
  title: {
    flex: 1,
    flexWrap: 'wrap',
    color: colors.moonDarkest,
  },
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
  const [focusRef, setFocus] = useAccessibilityFocus()

  useFocusEffect(setFocus)

  return (
    <View style={styles.container} testID={testID}>
      {onPressBack && (
        <Pressable
          hitSlop={HITSLOP}
          onPress={onPressBack}
          testID={addTestIdModifier(testID, 'backButton')}
          accessibilityRole="button"
          accessibilityLabel={t('back_button')}
          accessible>
          <Icon source="ArrowBack" width={24} height={24} />
        </Pressable>
      )}
      <View style={styles.titleContainer}>
        <TranslatedText
          ref={focusRef}
          testID={addTestIdModifier(testID, 'title')}
          i18nKey={titleI18nKey}
          textStyle="SubtitleExtrabold"
          textStyleOverrides={styles.title}
          accessibilityRole="header"
        />
      </View>
      {onPressClose && (
        <Pressable
          hitSlop={HITSLOP}
          style={styles.closeButton}
          onPress={onPressClose}
          testID={addTestIdModifier(testID, 'closeButton')}
          accessibilityRole="button"
          accessibilityLabel={t('close_button')}
          accessible>
          <Icon source="Close" width={24} height={24} />
        </Pressable>
      )}
    </View>
  )
}
