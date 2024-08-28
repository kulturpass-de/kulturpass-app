import React from 'react'
import { PixelRatio, Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'
import { useTextStyles } from '../../theme/hooks/use-text-styles'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import { isDeviceTextScaled } from '../../theme/utils'

const RADIUS = spacing[3]

export const SUGGESTION_LIST_ITEM_BORDER_RADIUS = RADIUS

export type SuggestionListItemProps = {
  title: string
  subtitle?: string
  accessibilityHint?: string
  testID?: string
  topRadius?: boolean
  bottomRadius?: boolean
  shadow?: boolean
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  onPress?: () => void
}

export const SuggestionListItem: React.FC<SuggestionListItemProps> = ({
  title,
  subtitle,
  accessibilityHint,
  topRadius,
  bottomRadius,
  shadow,
  style,
  textStyle,
  testID,
  onPress,
}) => {
  const { colors } = useTheme()
  const [textStyles] = useTextStyles()

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      accessibilityLabel={`${title}${subtitle ? '\n' + subtitle : ''}`}
      onPress={onPress}
      style={[
        styles.container,
        isDeviceTextScaled() ? { height: PixelRatio.getFontScale() * 42.5 + 9.5 } : undefined,
        {
          backgroundColor: colors.secondaryBackground,
        },
        topRadius && styles.topRadius,
        bottomRadius && styles.bottomRadius,
        shadow && styles.shadow,
        style,
      ]}>
      <Text
        numberOfLines={1}
        style={[textStyles.BodyRegular, styles.fullWidth, { color: colors.labelColor }, textStyle]}>
        {title}
      </Text>
      {subtitle ? (
        <Text numberOfLines={1} style={[textStyles.SuggestionInfo, styles.fullWidth, { color: colors.labelColor }]}>
          {subtitle}
        </Text>
      ) : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    paddingHorizontal: spacing[5],
  },
  topRadius: {
    borderTopLeftRadius: RADIUS,
    borderTopRightRadius: RADIUS,
  },
  bottomRadius: {
    borderBottomLeftRadius: RADIUS,
    borderBottomRightRadius: RADIUS,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fullWidth: {
    width: '100%',
  },
})
