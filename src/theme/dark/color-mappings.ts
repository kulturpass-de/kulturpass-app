import { colors } from '../colors'
import {
  ButtonColorMappings,
  ColorMappings,
  PreferencesButtonColors,
  ReservationListStatusTextColors,
  TryAgainButtonColors,
} from '../types'
import { toTransparentColor } from '../utils'

export const colorMappings: ColorMappings = {
  labelColor: colors.sunLightest,
  secondaryLabelColor: colors.sunBase,
  primaryBackground: colors.newMoonDarkest,
  secondaryBackground: colors.newMoonDarker,
  tabBarDivider: colors.newMoonBase,
  boxShadow: colors.primaryDarkest,
  infoBox: colors.primaryDarkestTile,
  budgetBarBorder: colors.sunLightest,
  budgetBarReserved: colors.secondaryDarkest,
  budgetBarAvailable: colors.sunLightest,
  listItemBorder: colors.sunLightest,
  footerBorder: colors.newMoonBase,
  reservationsTabBarIndicator: colors.sunLightest,
  textFieldPlaceholder: colors.sunBase,
  textFieldBorder: colors.sunLightest,
  textFieldBorderError: colors.redBase,
  textFieldBorderFocused: colors.primaryLight,
  checkboxBorder: colors.sunLightest,
  preferencesCategoryBorder: colors.sunLightest,
  preferencesCategoryShadow: colors.sunLightest,
  emphasizedPriceColor: colors.newMoonDarker,
  emphasizedPriceBackground: colors.primaryDarkest,
  divider: toTransparentColor(colors.sunLightest, 0.1),
  alertBackdrop: toTransparentColor(colors.moonDarker, 0.8),
}

export const preferenceButtonColors: PreferencesButtonColors = {
  concertAndStage: colors.newYellowDarkest,
  museumAndPark: colors.primaryDarkestTile,
  cinema: colors.newSecondaryDarkest,
  book: colors.newYellowDarkest,
  audioMedia: colors.primaryDarkestTile,
  sheetMusic: colors.newSecondaryDarkest,
  musicInstrument: colors.newYellowDarkest,
  unknown: colors.newSecondaryDarkest,
}

export const reservationListStatusTextColors: ReservationListStatusTextColors = {
  READY_FOR_PICKUP: colors.greenLighter,
  RECEIVED: colors.sunLightest,
  COMPLETED: colors.sunLightest,
  CANCELLED: colors.redLighter,
  CANCELLING: colors.redLighter,
  default: colors.primaryLighter,
}

export const buttonColorMappings: ButtonColorMappings = {
  primary: {
    containerBackground: colors.sunLightest,
    text: colors.newMoonDarker,
    containerBackgroundPressed: colors.sunLighter,
    containerBorderPressed: colors.sunLightest,
    containerBackgroundDisabled: toTransparentColor(colors.sunLightest, 0.55),
  },
  secondary: {
    containerBackground: colors.newMoonDarker,
    containerBorder: colors.sunLightest,
    text: colors.sunLightest,
    containerBackgroundPressed: toTransparentColor(colors.primaryLightest, 0.5),
    opacityDisabled: 0.55,
  },
  tertiary: {
    containerBackground: colors.newMoonDarker,
    containerBorder: colors.sunLightest,
    text: colors.sunLightest,
    shadow: colors.primaryDarkest,
    containerBackgroundPressed: colors.tertiaryButtonBackgroundPressedDark,
    shadowPressed: colors.sunLightest,
    containerBorderDisabled: toTransparentColor(colors.sunLightest, 0.55),
    shadowDisabled: toTransparentColor(colors.sunLightest, 0.55),
    disabledText: toTransparentColor(colors.sunLightest, 0.55),
  },
  white: {
    containerBackground: colors.newMoonDarker,
    text: colors.sunLightest,
    containerBackgroundPressed: toTransparentColor(colors.primaryLightest, 0.5),
    opacityDisabled: 0.55,
  },
  transparent: {
    containerBackground: toTransparentColor(colors.basicWhite, 0.0),
    text: colors.sunLightest,
    pressedText: colors.primaryLightest,
    opacityDisabled: 0.55,
  },
  error: {
    containerBackground: colors.redDarkest,
    containerBorder: colors.redDarkest,
    text: colors.basicWhite,
    containerBackgroundPressed: toTransparentColor(colors.redDarkest, 0.6),
    opacityDisabled: 0.55,
  },
}

const baseTryAgainButtonColors = {
  opacityDisabled: 0.55,
}

export const tryAgainButtonColors: TryAgainButtonColors = [
  {
    containerBackground: colors.secondaryLighter,
    containerBackgroundPressed: colors.secondaryLightest,
    containerBorder: colors.newSecondaryDarkest,
    shadow: colors.newSecondaryDarkest,
    text: colors.tryAgainTextDarkSecondary,
    ...baseTryAgainButtonColors,
  },
  {
    containerBackground: colors.yellowLighter,
    containerBackgroundPressed: colors.yellowLightest,
    containerBorder: colors.newYellowDarkest,
    shadow: colors.newYellowDarkest,
    text: colors.tryAgainTextDarkYellow,
    ...baseTryAgainButtonColors,
  },
  {
    containerBackground: colors.greenLighter,
    containerBackgroundPressed: colors.greenLightest,
    containerBorder: colors.tryAgainBorderGreen,
    shadow: colors.tryAgainBorderGreen,
    text: colors.tryAgainTextDarkGreen,
    ...baseTryAgainButtonColors,
  },
  {
    containerBackground: colors.primaryLighter,
    containerBackgroundPressed: colors.primaryLightest,
    containerBorder: colors.primaryDarkestTile,
    shadow: colors.primaryDarkestTile,
    text: colors.tryAgainTextDarkPrimary,
    ...baseTryAgainButtonColors,
  },
]
