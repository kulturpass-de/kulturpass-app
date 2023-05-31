import { PixelRatio } from 'react-native'

export const modalCardStyle = {
  backgroundColor: 'transparent',
}

export const isDeviceTextScaled = () => {
  return PixelRatio.getFontScale() > 1.0
}
