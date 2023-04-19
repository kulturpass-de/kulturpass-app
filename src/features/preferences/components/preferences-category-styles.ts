import { SvgImageType } from '../../../components/svg-image/svg-image'
import { PreferenceCategoryId } from '../../../services/api/types'
import { colors } from '../../../theme/colors'

export type ButtonStylesForCategory = {
  svgImageType: SvgImageType
  selectedBgColor: string
}

const preferenceButtonStyles = new Map<PreferenceCategoryId, ButtonStylesForCategory>([
  [
    'concertAndStage',
    {
      svgImageType: 'pic-concert',
      selectedBgColor: colors.yellowLightest,
    },
  ],
  [
    'museumAndPark',
    {
      svgImageType: 'pic-museum',
      selectedBgColor: colors.primaryLightest,
    },
  ],
  [
    'cinema',
    {
      svgImageType: 'pic-cinema',
      selectedBgColor: colors.secondaryLightest,
    },
  ],
  [
    'book',
    {
      svgImageType: 'pic-books',
      selectedBgColor: colors.yellowLightest,
    },
  ],
  [
    'audioMedia',
    {
      svgImageType: 'pic-soundcarrier',
      selectedBgColor: colors.primaryLightest,
    },
  ],
  [
    'sheetMusic',
    {
      svgImageType: 'pic-notes',
      selectedBgColor: colors.secondaryLightest,
    },
  ],
  [
    'musicInstrument',
    {
      svgImageType: 'pic-instruments',
      selectedBgColor: colors.yellowLightest,
    },
  ],
])

const unknownPreferenceCategory: ButtonStylesForCategory = {
  svgImageType: 'pic-unknown',
  selectedBgColor: colors.secondaryLightest,
}

export const buttonStyleForPreferenceCategory = (
  preferenceCategoryId: PreferenceCategoryId,
): ButtonStylesForCategory => {
  return preferenceButtonStyles.get(preferenceCategoryId) ?? unknownPreferenceCategory
}
