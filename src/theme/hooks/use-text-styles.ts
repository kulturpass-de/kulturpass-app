import { useMemo } from 'react'
import { StyleSheet, TextStyle } from 'react-native'
import { useIsBoldTextEnabled } from '../../utils/accessibility/hooks/use-is-bold-text-enabled'
import { textStyles as baseTextStyles, transformToBolderFontWeight } from '../typography'

export const useTextStyles = (): typeof textStyles => {
  const isBoldTextEnabled = useIsBoldTextEnabled()

  const textStyles = useMemo(() => {
    let newTextStyles: typeof baseTextStyles = baseTextStyles

    if (isBoldTextEnabled) {
      Object.keys(newTextStyles).forEach(key => {
        const indexKey = key as keyof typeof baseTextStyles

        newTextStyles = {
          ...newTextStyles,
          [indexKey]: {
            ...newTextStyles[indexKey],
            fontWeight: transformToBolderFontWeight(newTextStyles[indexKey].fontWeight),
          } as TextStyle,
        }
      })
    }

    return newTextStyles
  }, [isBoldTextEnabled])

  return StyleSheet.flatten({ ...textStyles })
}
