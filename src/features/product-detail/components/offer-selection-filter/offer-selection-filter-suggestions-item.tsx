import React from 'react'
import { PixelRatio, Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'
import { useTheme } from '../../../../theme/hooks/use-theme'
import { spacing } from '../../../../theme/spacing'
import { textStyles } from '../../../../theme/typography'
import { isDeviceTextScaled } from '../../../../theme/utils'

const RADIUS = spacing[3]

export type OfferSelectionFilterSuggestionsItemProps = {
  name: string
  info?: string
  accessibilityHint?: string
  testID?: string
  topRadius?: boolean
  bottomRadius?: boolean
  shadow?: boolean
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  onPress?: () => void
}

export const OfferSelectionFilterSuggestionsItem: React.FC<OfferSelectionFilterSuggestionsItemProps> = ({
  name,
  info,
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

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      accessibilityLabel={`${name}${info ? '\n' + info : ''}`}
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
        {name}
      </Text>
      {info ? (
        <Text numberOfLines={1} style={[textStyles.SuggestionInfo, styles.fullWidth, { color: colors.labelColor }]}>
          {info}
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
