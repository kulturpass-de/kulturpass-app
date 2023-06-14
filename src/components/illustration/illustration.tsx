import React from 'react'
import { Image, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native'
import { useTranslation } from '../../services/translation/translation'
import { AvailableTranslations } from '../translated-text/types'

export type IllustrationType =
  | 'onboarding'
  | 'localisation-consent'
  | 'data-privacy'
  | 'verify-mail'
  | 'registration-finished'
  | 'eid'
  | 'eid-scan'
  | 'success'
  | 'budget-received'
  | 'empty-state-reservations'
  | 'empty-state-reservations-closed'
  | 'favorites-empty-state'
  | 'stop-sign'
  | 'delete-account'
  | 'no-network'

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
    case 'data-privacy':
      return require('./imgs/data-privacy.png')
    case 'verify-mail':
      return require('./imgs/verify-mail.png')
    case 'registration-finished':
      return require('./imgs/registration-finished.png')
    case 'eid':
      return require('./imgs/eid.png')
    case 'eid-scan':
      return require('./imgs/eid-scan.png')
    case 'success':
      return require('./imgs/success.png')
    case 'budget-received':
      return require('./imgs/budget-received.png')
    case 'empty-state-reservations':
      return require('./imgs/empty-state-reservations.png')
    case 'empty-state-reservations-closed':
      return require('./imgs/empty-state-reservations-closed.png')
    case 'favorites-empty-state':
      return require('./imgs/favorites-empty-state.png')
    case 'stop-sign':
      return require('./imgs/stop-sign.png')
    case 'delete-account':
      return require('./imgs/delete-account.png')
    case 'no-network':
      return require('./imgs/no-network.png')
  }
}
