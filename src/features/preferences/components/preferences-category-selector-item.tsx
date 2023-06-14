import React, { useCallback, useMemo } from 'react'
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { SvgImage } from '../../../components/svg-image/svg-image'

import { PreferenceCategory } from '../../../services/api/types'
import { TestId, useTestIdBuilder } from '../../../services/test-id/test-id'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { buttonStyleForPreferenceCategory } from './preferences-category-styles'

export type PreferencesCategorySelectorItemProps = {
  testID: TestId
  isSelected?: boolean
  isSelectable?: boolean
  category: PreferenceCategory
  onSelect: (category: PreferenceCategory) => void
  style?: StyleProp<ViewStyle>
}

export const PreferencesCategorySelectorItem: React.FC<PreferencesCategorySelectorItemProps> = ({
  testID,
  isSelected,
  isSelectable = true,
  category,
  onSelect,
  style,
}) => {
  const { addTestIdModifier } = useTestIdBuilder()

  const onPress = useCallback(() => {
    if (isSelectable) {
      onSelect(category)
    }
  }, [isSelectable, onSelect, category])

  const buttonStyle = buttonStyleForPreferenceCategory(category.id)
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
      accessibilityState={{ checked: isSelected }}
      accessible>
      {({ pressed }) => (
        <>
          {(isSelected || pressed) && <View style={styles.shadow} />}
          <View
            style={[
              styles.container,
              (isSelected || pressed) && selectedStyle,
              !isSelectable && styles.disabled,
              style,
            ]}>
            <View style={styles.image}>
              <SvgImage
                type={buttonStyle.svgImageType}
                screenWidthRelativeSize={0.17}
                testID={addTestIdModifier(testID, 'image')}
              />
            </View>
            <View style={styles.content}>
              <Text style={[textStyles.CaptionExtrabold, styles.text]}>{category.name}</Text>
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
    backgroundColor: colors.basicWhite,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.basicBlack,
    zIndex: 1,
  },
  disabled: {
    opacity: 0.55,
  },
  shadow: {
    position: 'absolute',
    top: 3,
    left: 3,
    backgroundColor: colors.basicBlack,
    borderRadius: 10,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  image: {
    zIndex: 2,
    left: -7,
  },
  text: {
    color: colors.moonDarkest,
  },
  content: {
    zIndex: 20,
    minHeight: 64,
    padding: spacing[4] / 2,
    paddingRight: spacing[5],
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
})
