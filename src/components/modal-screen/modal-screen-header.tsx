import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { View, Pressable, StyleSheet, PressableProps } from 'react-native'
import useAccessibilityFocus from '../../navigation/a11y/use-accessibility-focus'
import { TestId, useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { HITSLOP } from '../../theme/constants'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import { SvgImage } from '../svg-image/svg-image'
import { TranslatedText } from '../translated-text/translated-text'
import { AvailableTranslations } from '../translated-text/types'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[3],
    minHeight: 56,
  },
  titleContainer: { paddingHorizontal: 6, flexDirection: 'row', flexShrink: 1 },
  closeButton: { marginRight: 6, flexShrink: 0 },
  title: { flexWrap: 'wrap' },
})

export type ModalScreenHeaderProps = {
  testID: TestId
  titleI18nKey: AvailableTranslations
  onPressTitle?: PressableProps['onPress']
  onPressBack?: PressableProps['onPress']
  onPressClose?: PressableProps['onPress']
}

export const ModalScreenHeader: React.FC<ModalScreenHeaderProps> = ({
  testID,
  titleI18nKey,
  onPressTitle,
  onPressBack,
  onPressClose,
}) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { addTestIdModifier } = useTestIdBuilder()
  const [focusRef, setFocus] = useAccessibilityFocus()

  useFocusEffect(setFocus)

  return (
    <View style={[styles.container, { backgroundColor: colors.secondaryBackground }]} testID={testID}>
      {onPressBack && (
        <Pressable
          hitSlop={HITSLOP}
          onPress={onPressBack}
          testID={addTestIdModifier(testID, 'backButton')}
          accessibilityRole="button"
          accessibilityLabel={t('back_button')}
          accessible>
          <SvgImage type="arrow-back" width={24} height={24} />
        </Pressable>
      )}
      <View style={styles.titleContainer}>
        {onPressTitle ? (
          <Pressable onPress={onPressTitle} testID={addTestIdModifier(testID, 'titleButton')}>
            <TranslatedText
              ref={focusRef}
              testID={addTestIdModifier(testID, 'text')}
              i18nKey={titleI18nKey}
              textStyle="SubtitleExtrabold"
              textStyleOverrides={[styles.title, { color: colors.labelColor }]}
              accessibilityRole="header"
            />
          </Pressable>
        ) : (
          <TranslatedText
            ref={focusRef}
            testID={addTestIdModifier(testID, 'text')}
            i18nKey={titleI18nKey}
            textStyle="SubtitleExtrabold"
            textStyleOverrides={[styles.title, { color: colors.labelColor }]}
            accessibilityRole="header"
          />
        )}
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
          <SvgImage type="close" width={24} height={24} />
        </Pressable>
      )}
    </View>
  )
}
