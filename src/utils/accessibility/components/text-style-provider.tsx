import React, { createContext, PropsWithChildren, useMemo } from 'react'
import { StyleSheet, TextStyle } from 'react-native'
import { textStyles as baseTextStyles, transformToBolderFontWeight } from '../../../theme/typography'
import { useIsBoldTextEnabled } from '../hooks/use-is-bold-text-enabled'

export type TextStyleValue = {
  textStyles: typeof baseTextStyles
}

export const TextStyleContext = createContext<TextStyleValue | null>(null)

export const TextStyleProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const isBoldTextEnabled = useIsBoldTextEnabled()

  const computedTextStyles = useMemo(() => {
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

    return StyleSheet.flatten({ ...newTextStyles })
  }, [isBoldTextEnabled])

  const providerValue: TextStyleValue = useMemo(() => ({ textStyles: computedTextStyles }), [computedTextStyles])

  return <TextStyleContext.Provider value={providerValue}>{children}</TextStyleContext.Provider>
}
