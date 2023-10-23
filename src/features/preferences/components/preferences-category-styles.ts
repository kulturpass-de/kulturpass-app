import { SvgImageProps } from '../../../components/svg-image/svg-image'
import { PreferenceCategoryId } from '../../../services/api/types'
import { preferenceButtonColors as preferenceButtonColorsDark } from '../../../theme/dark/color-mappings'
import { preferenceButtonColors as preferenceButtonColorsLight } from '../../../theme/light/color-mappings'
import { PreferencesButtonColors } from '../../../theme/types'

export type ButtonStylesForCategory = {
  svgImageType: SvgImageProps['type']
  selectedBgColor: string
}

const preferenceButtonImages: { [key: PreferenceCategoryId]: SvgImageProps['type'] } = {
  concertAndStage: 'pic-concert',
  museumAndPark: 'pic-museum',
  cinema: 'pic-cinema',
  book: 'pic-books',
  audioMedia: 'pic-soundcarrier',
  sheetMusic: 'pic-notes',
  musicInstrument: 'pic-instruments',
  culturalWorkshop: 'pic-workshop',
}

export const buttonStyleForPreferenceCategory = (
  preferenceCategoryId: PreferenceCategoryId,
  colorScheme: 'dark' | 'light',
): ButtonStylesForCategory => {
  const preferencesColorScheme = colorScheme === 'dark' ? preferenceButtonColorsDark : preferenceButtonColorsLight
  const selectedBgColor =
    preferencesColorScheme[preferenceCategoryId as keyof PreferencesButtonColors] ?? preferencesColorScheme.unknown
  return {
    svgImageType: preferenceButtonImages[preferenceCategoryId] ?? 'pic-unknown',
    selectedBgColor,
  }
}
