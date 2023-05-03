import React from 'react'
import { StyleSheet, Pressable, Text, PressableProps } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTestIdBuilder } from '../../services/test-id/test-id'

import { useTranslation } from '../../services/translation/translation'
import { colors } from '../../theme/colors'
import { textStyles } from '../../theme/typography'
import { Icon } from '../icon/icon'

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.basicWhite,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 36,
    paddingLeft: 16,
    paddingBottom: 12,
    marginBottom: 0,
  },
  containerBorderBottom: {
    paddingBottom: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F5',
  },
  backButton: { width: 24, height: 24, marginRight: 14 },
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
  onPress?: PressableProps['onPress']
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

  const containerBorderBottomStyle = borderBottom ? styles.containerBorderBottom : {}

  const titleFont = screenType === 'screen' ? textStyles.HeadlineH3Extrabold : textStyles.SubtitleExtrabold

  const screenHeaderContent = (
    <SafeAreaView edges={['top']} style={[styles.container, containerBorderBottomStyle]} testID={testID}>
      {onPressBack && (
        <Pressable
          style={styles.backButton}
          onPress={onPressBack}
          testID={addTestIdModifier(testID, 'backButton')}
          accessibilityLabel={t('back_button')}
          accessible>
          <Icon source="ArrowBack" />
        </Pressable>
      )}
      <Text
        style={[titleFont, styles.title]}
        testID={addTestIdModifier(testID, 'titleText')}
        accessibilityLabel={title}
        accessible>
        {title}
      </Text>
      {onPressClose && (
        <Pressable
          style={styles.closeButton}
          onPress={onPressClose}
          testID={addTestIdModifier(testID, 'closeButton')}
          accessibilityLabel={t('close_button')}
          accessible>
          <Icon source="Close" />
        </Pressable>
      )}
    </SafeAreaView>
  )

  return onPress ? <Pressable onPress={onPress}>{screenHeaderContent}</Pressable> : screenHeaderContent
}
