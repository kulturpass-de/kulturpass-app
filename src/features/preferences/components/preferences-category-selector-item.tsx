import React, { useCallback, useMemo } from 'react'
import { Platform, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { PreferenceCategory } from '../../../services/api/types'
import { TestId, useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTextStyles } from '../../../theme/hooks/use-text-styles'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { buttonStyleForPreferenceCategory } from './preferences-category-styles'

export type PreferencesCategorySelectorItemProps = {
  testID: TestId
  isSelected?: boolean
  isSelectable?: boolean
  category: PreferenceCategory
  onSelect: (category: PreferenceCategory) => void
  style?: StyleProp<ViewStyle>
  variant: 'column' | 'rows'
}

const SHIFT_LEFT = -7
const SHIFT_LEFT_IMAGE_SCALE = -6

export const PreferencesCategorySelectorItem: React.FC<PreferencesCategorySelectorItemProps> = ({
  testID,
  isSelected,
  isSelectable = true,
  category,
  onSelect,
  style,
  variant,
}) => {
  const { colors, colorScheme } = useTheme()
  const { addTestIdModifier } = useTestIdBuilder()
  const textStyles = useTextStyles()

  const onPress = useCallback(() => {
    if (isSelectable) {
      onSelect(category)
    }
  }, [isSelectable, onSelect, category])

  const buttonStyle = buttonStyleForPreferenceCategory(category.id, colorScheme)
  const selectedStyle = useMemo(
    () => ({ backgroundColor: buttonStyle?.selectedBgColor }),
    [buttonStyle?.selectedBgColor],
  )

  return (
    <Pressable
      onPress={onPress}
      disabled={!isSelectable}
      accessibilityLabel={category.name}
      accessibilityRole="togglebutton"
      accessibilityState={Platform.select({
        default: { checked: isSelected },
        ios: { selected: isSelected }, // iOS will announce "checked" in english, even if language is set to german
      })}
      accessible>
      {({ pressed }) => (
        <>
          {(isSelected || pressed) && (
            <View style={[styles.shadow, { backgroundColor: colors.preferencesCategoryShadow }]} />
          )}
          <View
            style={[
              styles.container,
              { backgroundColor: colors.secondaryBackground, borderColor: colors.preferencesCategoryBorder },
              (isSelected || pressed) && selectedStyle,
              !isSelectable && styles.disabled,
              style,
            ]}>
            <View style={styles.imageContainer}>
              <View style={[styles.image, { transform: [{ translateX: SHIFT_LEFT }] }]}>
                <SvgImage
                  type={buttonStyle.svgImageType}
                  screenWidthRelativeSize={0.17}
                  testID={addTestIdModifier(testID, 'image')}
                />
              </View>
            </View>
            <View style={styles.contentContainer}>
              <View
                style={[
                  styles.content,
                  variant === 'rows' ? styles.contentAbsolute : styles.contentRelative,
                  {
                    left: SHIFT_LEFT + SHIFT_LEFT_IMAGE_SCALE,
                  },
                ]}>
                <Text
                  numberOfLines={4}
                  android_hyphenationFrequency="normal"
                  style={[textStyles.CaptionExtrabold, styles.categoryName, { color: colors.labelColor }]}>
                  {category.name}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 64,
    borderRadius: 10,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflow: 'hidden',
    borderWidth: 1,
    zIndex: 1,
  },
  disabled: {
    opacity: 0.55,
  },
  shadow: {
    position: 'absolute',
    top: 3,
    left: 3,
    borderRadius: 10,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    zIndex: 2,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  content: {
    zIndex: 20,
    minHeight: 64,
    paddingVertical: spacing[4] / 2,
    paddingRight: spacing[0],
    paddingLeft: spacing[2],
    alignItems: 'center',
    flexDirection: 'row',
  },
  contentAbsolute: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  contentRelative: {},
  categoryName: {
    letterSpacing: 0.2,
  },
})
