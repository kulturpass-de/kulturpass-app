import React, { createContext, PropsWithChildren, useMemo } from 'react'
import { StyleSheet, Text, TextStyle } from 'react-native'
import { translatedTextStyles } from '../../../components/translated-text/translated-text-components'
import { textStyles as baseTextStyles, transformToBolderFontWeight } from '../../../theme/typography'
import { useIsBoldTextEnabled } from '../hooks/use-is-bold-text-enabled'

export type TextStyleValue = {
  textStyles: typeof baseTextStyles
  translatedTextStyles: typeof translatedTextStyles
  translatedTextComponents: Record<string, React.ReactElement>
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

  const computedTranslatedTextStyles = useMemo(() => {
    let newTextStyles: typeof translatedTextStyles = translatedTextStyles

    if (isBoldTextEnabled) {
      Object.keys(newTextStyles).forEach(key => {
        const indexKey = key as keyof typeof translatedTextStyles

        if (indexKey === 'base') {
          return
        }

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

  const computedTranslatedTextComponents = useMemo(() => {
    const obj: Record<string, React.ReactElement> = {}

    Object.keys(computedTranslatedTextStyles).forEach(key => {
      obj[key] = <Text style={(computedTranslatedTextStyles as Record<string, TextStyle>)[key]} />
    })

    return obj
  }, [computedTranslatedTextStyles])

  const providerValue: TextStyleValue = useMemo(
    () => ({
      textStyles: computedTextStyles,
      translatedTextStyles: computedTranslatedTextStyles,
      translatedTextComponents: computedTranslatedTextComponents,
    }),
    [computedTextStyles, computedTranslatedTextStyles, computedTranslatedTextComponents],
  )

  return <TextStyleContext.Provider value={providerValue}>{children}</TextStyleContext.Provider>
}
