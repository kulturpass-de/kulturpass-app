import { ImageSourcePropType } from 'react-native'
import { IllustrationType } from '../../components/illustration/illustration'
import { RequiredAnimatedIllustration } from '../types'

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
    case 'password':
      return require('./illustrations/password.png')
    case 'release-notes':
      return require('./illustrations/release-notes.png')
    case 'bank-id':
      return require('./illustrations/bank-id.png')
    case 'select-identification':
      return require('./illustrations/select-identification.png')
  }
}

export function requireIllustrationAnimation(type: IllustrationType): RequiredAnimatedIllustration | undefined {
  switch (type) {
    case 'onboarding':
      return require('./illustrations/onboarding.json')
    case 'empty-state-reservations':
      return require('./illustrations/empty-state-reservations.json')
    case 'empty-state-reservations-closed':
      return require('./illustrations/empty-state-reservations-closed.json')
    case 'favorites-empty-state':
      return require('./illustrations/favorites-empty-state.json')
    case 'registration-finished':
      return require('./illustrations/registration-finished.json')
    case 'verify-mail':
      return require('./illustrations/verify-mail.json')
    case 'release-notes':
      return require('./illustrations/release-notes.json')
    case 'localisation-consent':
      return require('./illustrations/localisation-consent.json')
    case 'notification-permission':
      return require('./illustrations/notification-permission.json')
  }
}
