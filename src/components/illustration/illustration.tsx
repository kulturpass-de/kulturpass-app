import React from 'react'
import { Image, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native'
import { useTranslation } from '../../services/translation/translation'
import { AvailableTranslations } from '../translated-text/types'

export type IllustrationType =
  | 'onboarding'
  | 'localisation-consent'
  | 'notification-consent'
  | 'data-privacy'
  | 'verify-mail'
  | 'registration-finished'
  | 'eid'
  | 'eid-scan'
  | 'eid-pin-changed'
  | 'budget-received'
  | 'empty-state-reservations'
  | 'empty-state-reservations-closed'
  | 'favorites-empty-state'
  | 'nfc-not-supported'

export type IllustrationProps = {
  type: IllustrationType
  i18nKey: AvailableTranslations
  testID: string
  style?: StyleProp<ImageStyle>
}

export const Illustration: React.FC<IllustrationProps> = ({
  type,
  i18nKey,
  testID,
  style = {
    width: '100%',
  },
}) => {
  const { t } = useTranslation()

  return (
    <Image
      testID={testID}
      accessible={true}
      accessibilityLabel={t(i18nKey)}
      style={style}
      source={requireImage(type)}
    />
  )
}

function requireImage(type: IllustrationType): ImageSourcePropType {
  switch (type) {
    case 'onboarding':
      return require('./imgs/onboarding.png')
    case 'localisation-consent':
      return require('./imgs/localisation-consent.png')
    case 'notification-consent':
      return require('./imgs/notification-consent.png')
    case 'data-privacy':
      return require('./imgs/data-privacy.png')
    case 'verify-mail':
      return require('./imgs/verify-mail.png')
    case 'registration-finished':
      return require('./imgs/verify-mail.png')
    case 'eid':
      return require('./imgs/eid.png')
    case 'eid-scan':
      return require('./imgs/eid-scan.png')
    case 'eid-pin-changed':
      return require('./imgs/eid-pin-changed.png')
    case 'budget-received':
      return require('./imgs/budget-received.png')
    case 'empty-state-reservations':
      return require('./imgs/empty-state-reservations.png')
    case 'empty-state-reservations-closed':
      return require('./imgs/empty-state-reservations-closed.png')
    case 'favorites-empty-state':
      return require('./imgs/favorites-empty-state.png')
    case 'nfc-not-supported':
      return require('./imgs/nfc-not-supported.png')
  }
}
