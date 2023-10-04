import { ImageSourcePropType } from 'react-native'
import { IllustrationType } from '../../components/illustration/illustration'

export function requireIllustrationImage(type: IllustrationType): ImageSourcePropType {
  switch (type) {
    case 'onboarding':
      return require('./illustrations/onboarding.png')
    case 'localisation-consent':
      return require('./illustrations/localisation-consent.png')
    case 'data-privacy':
      return require('./illustrations/data-privacy.png')
    case 'verify-mail':
      return require('./illustrations/verify-mail.png')
    case 'registration-finished':
      return require('./illustrations/registration-finished.png')
    case 'eid':
      return require('./illustrations/eid.png')
    case 'eid-card-positioning-ios':
      return require('./illustrations/eid-card-positioning-ios.png')
    case 'eid-card-positioning-android':
      return require('./illustrations/eid-card-positioning-android.png')
    case 'eid-nfc-disabled':
      return require('./illustrations/eid-nfc-disabled.png')
    case 'success':
      return require('./illustrations/success.png')
    case 'budget-received':
      return require('./illustrations/budget-received.png')
    case 'empty-state-reservations':
      return require('./illustrations/empty-state-reservations.png')
    case 'empty-state-reservations-closed':
      return require('./illustrations/empty-state-reservations-closed.png')
    case 'favorites-empty-state':
      return require('./illustrations/favorites-empty-state.png')
    case 'stop-sign':
      return require('./illustrations/stop-sign.png')
    case 'delete-account':
      return require('./illustrations/delete-account.png')
    case 'no-network':
      return require('./illustrations/no-network.png')
    case 'location-sharing':
      return require('./illustrations/location-sharing.png')
    case 'notification-permission':
      return require('./illustrations/notification-permission.png')
  }
}
