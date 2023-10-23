import { AnimationIconType } from '../../animated-icon'

export function requireIconAnimation(type: AnimationIconType): any {
  switch (type) {
    case 'copy':
      return require('./copy.json')
    case 'heart':
      return require('./heart.json')
    case 'favorites-tab':
      return require('./favorites-tab.json')
    case 'home-tab':
      return require('./home-tab.json')
    case 'reservations-tab':
      return require('./reservations-tab.json')
    case 'search-tab':
      return require('./search-tab.json')
    case 'profile-tab':
      return require('./profile-tab.json')
  }
}
