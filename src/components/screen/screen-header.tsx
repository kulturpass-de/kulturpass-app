import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { StyleSheet, Pressable, Text, TextProps } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAccessibilityFocus from '../../navigation/a11y/use-accessibility-focus'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { HITSLOP } from '../../theme/constants'
import { useTheme } from '../../theme/hooks/use-theme'
import { textStyles } from '../../theme/typography'
import { SvgImage } from '../svg-image/svg-image'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 36,
    paddingLeft: 16,
    paddingBottom: 12,
    columnGap: 14,
  },
  backButton: { width: 24, height: 24 },
  closeButton: { width: 24, height: 24, marginRight: 14 },
  title: {
    flex: 1,
  },
})

export type ScreenHeaderProps = {
  title: string
  testID: string
  onPressBack?: () => void
  onPressClose?: () => void
  onPress?: TextProps['onPress']
  screenType?: 'screen' | 'subscreen'
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  testID,
  onPressBack,
  onPressClose,
  screenType = 'screen',
  onPress,
}) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { addTestIdModifier } = useTestIdBuilder()
  const [focusRef, setFocus] = useAccessibilityFocus()

  useFocusEffect(setFocus)

  const titleFont = screenType === 'screen' ? textStyles.HeadlineH3Extrabold : textStyles.SubtitleExtrabold

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor: colors.secondaryBackground }]}
      testID={addTestIdModifier(testID, 'header')}>
      {onPressBack && (
        <Pressable
          hitSlop={HITSLOP}
          style={styles.backButton}
          onPress={onPressBack}
          testID={addTestIdModifier(testID, 'backButton')}
          accessibilityLabel={t('back_button')}
          accessibilityRole="button"
          accessible>
          <SvgImage type="arrow-back" width={24} height={24} />
        </Pressable>
      )}
      <Text
        ref={focusRef}
        onPress={onPress}
        style={[titleFont, styles.title, { color: colors.labelColor }]}
        testID={testID}
        accessibilityRole="header"
        accessibilityLabel={title}
        accessible>
        {title}
      </Text>
      {onPressClose && (
        <Pressable
          hitSlop={HITSLOP}
          style={styles.closeButton}
          onPress={onPressClose}
          testID={addTestIdModifier(testID, 'closeButton')}
          accessibilityLabel={t('close_button')}
          accessibilityRole="button"
          accessible>
          <SvgImage type="close" width={24} height={24} />
        </Pressable>
      )}
    </SafeAreaView>
  )
}
