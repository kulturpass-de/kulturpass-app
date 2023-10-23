import { useEffect, useState } from 'react'
import { ColorSchemeName, useColorScheme as useRNColorScheme } from 'react-native'
import { useSelector } from 'react-redux'
import { selectIsInForeground } from '../../services/redux/slices/app-core'

/**
 * `useColorScheme` from the 'react-native' package
 * returns the opposite color scheme
 * whenever the app gets into the background
 *
 * This is a workaround, which updates the color scheme
 * only when the app is in foreground
 *
 * See the linked github issue for more information
 *
 * @see {@link https://github.com/facebook/react-native/issues/28525}
 */
export const useColorScheme = (): ColorSchemeName => {
  const appIsInForeground = useSelector(selectIsInForeground)

  const colorScheme = useRNColorScheme()
  const [currentScheme, setCurrentScheme] = useState(colorScheme)

  useEffect(() => {
    if (appIsInForeground) {
      setCurrentScheme(colorScheme)
    }
  }, [appIsInForeground, colorScheme])

  return currentScheme
}
