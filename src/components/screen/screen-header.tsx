import React from 'react'
import { StyleSheet, Pressable, Text, TextProps } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { colors } from '../../theme/colors'
import { textStyles } from '../../theme/typography'
import { Icon } from '../icon/icon'
import { HITSLOP } from '../../theme/constants'
import { useFocusEffect } from '@react-navigation/native'
import useAccessibilityFocus from '../../navigation/a11y/use-accessibility-focus'

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.basicWhite,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 36,
    paddingLeft: 16,
    paddingBottom: 12,
    columnGap: 14,
  },
  containerBorderBottom: {
    paddingBottom: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F5',
  },
  backButton: { width: 24, height: 24 },
  closeButton: { width: 24, height: 24, marginRight: 14 },
  title: {
    flex: 1,
    color: colors.moonDarkest,
  },
})

export type ScreenHeaderProps = {
  title: string
  testID: string
  onPressBack?: () => void
  onPressClose?: () => void
  borderBottom?: boolean
  onPress?: TextProps['onPress']
  screenType?: 'screen' | 'subscreen'
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  testID,
  onPressBack,
  onPressClose,
  borderBottom,
  screenType = 'screen',
  onPress,
}) => {
  const { t } = useTranslation()
  const { addTestIdModifier } = useTestIdBuilder()
  const [focusRef, setFocus] = useAccessibilityFocus()

  useFocusEffect(setFocus)

  const containerBorderBottomStyle = borderBottom ? styles.containerBorderBottom : {}

  const titleFont = screenType === 'screen' ? textStyles.HeadlineH3Extrabold : textStyles.SubtitleExtrabold

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, containerBorderBottomStyle]}
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
          <Icon source="ArrowBack" />
        </Pressable>
      )}
      <Text
        ref={focusRef}
        onPress={onPress}
        style={[titleFont, styles.title]}
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
          <Icon source="Close" />
        </Pressable>
      )}
    </SafeAreaView>
  )
}
