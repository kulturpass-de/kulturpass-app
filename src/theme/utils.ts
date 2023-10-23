import { ColorSchemeName, PixelRatio } from 'react-native'
import { logger } from '../services/logger'
import { colorMappings as colorMappingsDark } from './dark/color-mappings'
import { colorMappings as colorMappingsLight } from './light/color-mappings'
import { ColorMappings } from './types'

export const modalCardStyle = {
  backgroundColor: 'transparent',
}

export const isDeviceTextScaled = () => {
  return PixelRatio.getFontScale() > 1.0
}

export const toTransparentColor = (color: string, opacity: number, transparencyEnabled: boolean = true) => {
  if (__DEV__) {
    if (color.length !== 7 || color.match(/^#[0-9a-fA-F]{6}$/) === null) {
      logger.warn('Color is not valid Hex RGB', color)
    }

    if (opacity < 0.0 || opacity > 1.0) {
      logger.warn('Opacity is not in range 0.0 - 1.0', opacity)
    }
  }

  if (!transparencyEnabled) {
    return color
  }

  return (
    color +
    Math.floor(opacity * 255)
      .toString(16)
      .toUpperCase()
      .padStart(2, '0')
  )
}

export type ThemeValue = {
  colorScheme: 'light' | 'dark'
  colors: ColorMappings
}

export const getTheme = (colorScheme: ColorSchemeName, darkModePreviewEnabled: boolean): ThemeValue => {
  if (!darkModePreviewEnabled) {
    return {
      colorScheme: 'light',
      colors: colorMappingsLight,
    }
  }

  if (colorScheme === 'dark') {
    return {
      colorScheme: 'dark',
      colors: colorMappingsDark,
    }
  } else {
    return {
      colorScheme: 'light',
      colors: colorMappingsLight,
    }
  }
}
