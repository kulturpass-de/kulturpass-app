import React, { useMemo } from 'react'
import { Dimensions } from 'react-native'
import { SvgProps } from 'react-native-svg'
import { useTranslation } from '../../services/translation/translation'
import { AvailableTranslations } from '../translated-text/types'

import {
  AusweisApp2,
  BrowserPopup,
  Canceled,
  CrossCircleRed,
  Hourglass,
  HourglassTilted,
  LogoCompact,
  LogoHorizontal,
  OrderPending,
  OrderPending03,
  OrderRedeemed,
  Password,
  /**
   * Pic* => Preferences Screen, Pic*2 => Product Confirm Overview
   * Pic*2 are mostly mirrored versions of Pic*
   **/
  PicBooks,
  PicBooks2,
  PicCinema,
  PicCinema2,
  PicConcert,
  PicConcert2,
  PicInstruments,
  PicInstruments2,
  PicMuseum,
  PicMuseum2,
  PicNotes,
  PicNotes2,
  PicSoundcarrier,
  PicSoundcarrier2,
  PicUnknown,
  PlaceholderCircle,
  PlaceholderRectange,
  TicketCheckmark,
  TransperatentSquare,
  DeleteAccount,
  WebviewSkeleton,
  InformationCircle,
} from './svgs'

export type SvgImageType =
  | 'placeholder-circle'
  | 'placeholder-rectangle'
  | 'transparent-square'
  | 'ausweis-app-2'
  | 'browser-popup'
  | 'budget-received'
  | 'canceled'
  | 'cross-circle-red'
  | 'data-privacy'
  | 'eid-scan'
  | 'eid'
  | 'empty-state-reservations-closed'
  | 'empty-state-reservations'
  | 'hourglass'
  | 'hourglass-tilted'
  | 'localisation-consent'
  | 'logo-compact'
  | 'logo-horizontal'
  | 'notification-consent'
  | 'onboarding'
  | 'order-pending-03'
  | 'order-pending'
  | 'order-redeemed'
  | 'password'
  | 'pic-books'
  | 'pic-books-2'
  | 'pic-cinema'
  | 'pic-cinema-2'
  | 'pic-concert'
  | 'pic-concert-2'
  | 'pic-instruments'
  | 'pic-instruments-2'
  | 'pic-museum'
  | 'pic-museum-2'
  | 'pic-notes'
  | 'pic-notes-2'
  | 'pic-soundcarrier'
  | 'pic-soundcarrier-2'
  | 'placeholder-circle'
  | 'placeholder-rectangle'
  | 'pic-unknown'
  | 'ticket-checkmark'
  | 'verify-email'
  | 'backdrop-large'
  | 'delete-account'
  | 'webview-skeleton'
  | 'information-circle'

export type SvgImageProps = {
  type: SvgImageType

  /**
   * overrides screenWidthRelativeSize
   */
  width?: number

  /**
   * overrides screenWidthRelativeSize
   */
  height?: number

  /**
   * width and height relative [0 ... 1.0] to device screen width
   *
   * 0.5 by default
   */
  screenWidthRelativeSize?: number

  i18nKey?: AvailableTranslations
  testID: string
}

export const SvgImage: React.FC<SvgImageProps> = ({
  type,
  width,
  height,
  screenWidthRelativeSize = 0.5,
  i18nKey,
  testID,
}) => {
  const { t } = useTranslation()

  const [adjustedWidth, adjustedHeight] = useMemo(() => {
    const screenWidth = Dimensions.get('screen').width
    return [
      width && width > 0 ? width : screenWidth * screenWidthRelativeSize,
      height && height > 0 ? height : screenWidth * screenWidthRelativeSize,
    ]
  }, [width, height, screenWidthRelativeSize])

  const svgProps: SvgProps = {
    width: adjustedWidth,
    height: adjustedHeight,
    testID,
    accessible: !!i18nKey,
    accessibilityRole: 'image',
  }

  if (svgProps.accessible) {
    svgProps.accessibilityLabel = t(i18nKey!)
  }

  // TODO: extend this for each SVG
  switch (type) {
    case 'ausweis-app-2':
      return <AusweisApp2 {...svgProps} />
    case 'browser-popup':
      return <BrowserPopup {...svgProps} />
    case 'canceled':
      return <Canceled {...svgProps} />
    case 'cross-circle-red':
      return <CrossCircleRed {...svgProps} />
    case 'logo-compact':
      return <LogoCompact {...svgProps} />
    case 'logo-horizontal':
      return <LogoHorizontal {...svgProps} />
    case 'hourglass':
      return <Hourglass {...svgProps} />
    case 'hourglass-tilted':
      return <HourglassTilted {...svgProps} />
    case 'order-pending-03':
      return <OrderPending03 {...svgProps} />
    case 'order-pending':
      return <OrderPending {...svgProps} />
    case 'order-redeemed':
      return <OrderRedeemed {...svgProps} />
    case 'password':
      return <Password {...svgProps} />
    case 'pic-books':
      return <PicBooks {...svgProps} />
    case 'pic-books-2':
      return <PicBooks2 {...svgProps} />
    case 'pic-cinema':
      return <PicCinema {...svgProps} />
    case 'pic-cinema-2':
      return <PicCinema2 {...svgProps} />
    case 'pic-concert':
      return <PicConcert {...svgProps} />
    case 'pic-concert-2':
      return <PicConcert2 {...svgProps} />
    case 'pic-instruments':
      return <PicInstruments {...svgProps} />
    case 'pic-instruments-2':
      return <PicInstruments2 {...svgProps} />
    case 'pic-museum':
      return <PicMuseum {...svgProps} />
    case 'pic-museum-2':
      return <PicMuseum2 {...svgProps} />
    case 'pic-notes':
      return <PicNotes {...svgProps} />
    case 'pic-notes-2':
      return <PicNotes2 {...svgProps} />
    case 'pic-soundcarrier':
      return <PicSoundcarrier {...svgProps} />
    case 'pic-soundcarrier-2':
      return <PicSoundcarrier2 {...svgProps} />
    case 'pic-unknown':
      return <PicUnknown {...svgProps} />
    case 'transparent-square':
      return <TransperatentSquare {...svgProps} />
    case 'placeholder-circle':
      return <PlaceholderCircle {...svgProps} />
    case 'ticket-checkmark':
      return <TicketCheckmark {...svgProps} />
    case 'delete-account':
      return <DeleteAccount {...svgProps} />
    case 'webview-skeleton':
      return <WebviewSkeleton {...svgProps} />
    case 'information-circle':
      return <InformationCircle {...svgProps} />
    case 'placeholder-rectangle':
    default:
      return <PlaceholderRectange {...svgProps} />
  }
}
