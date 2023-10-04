import React from 'react'
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native'
import { useTheme } from '../../../../theme/hooks/use-theme'
import { spacing } from '../../../../theme/spacing'
import { textStyles } from '../../../../theme/typography'

const RADIUS = spacing[3]

export type OfferSelectionFilterSuggestionsItemProps = {
  name: string
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
      accessibilityLabel={name}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: colors.secondaryBackground,
        },
        topRadius && styles.topRadius,
        bottomRadius && styles.bottomRadius,
        shadow && styles.shadow,
        style,
      ]}>
      <Text numberOfLines={1} style={[textStyles.BodyRegular, { color: colors.labelColor }, textStyle]}>
        {name}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
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
})
