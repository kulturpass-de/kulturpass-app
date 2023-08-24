import React, { useCallback, useState } from 'react'
import { NativeSyntheticEvent, StyleSheet, Text, TextLayoutEventData, View } from 'react-native'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import { textStyles } from '../../theme/typography'

export type FavoritesListItemImageBadgeProps = {
  testID: string
  children: string
}

export const FavoritesListItemImageBadge = ({ children, testID }: FavoritesListItemImageBadgeProps) => {
  const { colors } = useTheme()

  const [lines, setLines] = useState<TextLayoutEventData['lines']>()

  const onTextLayout = useCallback((evt: NativeSyntheticEvent<TextLayoutEventData>) => {
    setLines(evt.nativeEvent.lines)
  }, [])

  return (
    <View style={styles.container} testID={testID}>
      {lines?.map((line, index) => {
        const paddingVertical = spacing[0] * 2
        const paddingHorizontal = spacing[2] * 2
        const shouldAddPaddingRight = line.text[line.text.length - 1] !== ' '
        return (
          <View
            key={`${index}`}
            style={[
              styles.bgText,
              {
                backgroundColor: colors.secondaryBackground,
                width: line.width + paddingHorizontal + (shouldAddPaddingRight ? spacing[1] : 0),
                height: line.height + paddingVertical,
                top: line.y - paddingVertical / 2,
                left: line.x - paddingHorizontal / 2,
              },
            ]}
          />
        )
      })}
      <Text
        onTextLayout={onTextLayout}
        style={[textStyles.MicroExtraboldCaps, styles.text, { color: colors.labelColor }]}>
        {children}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing[6] - 4,
  },
  text: {
    paddingHorizontal: spacing[2],
    // design says 14, but the final result in the app
    // doesn't fit the design. Visually 18 fits more
    lineHeight: 18,
  },
  bgText: {
    position: 'absolute',
  },
})
