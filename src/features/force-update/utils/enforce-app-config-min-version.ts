import { gt } from 'semver'
import pkg from '../../../../package.json'
import { rootNavigationRef } from '../../../navigation/navigation-container'
import { AppConfig } from '../../../services/redux/slices/app-core'
import { ForceUpdateRouteName } from '../screens/force-update-route'

export const enforceAppConfigMinVersion = (appConfig: AppConfig) => {
  if (gt(appConfig.appVersions.min, pkg.version)) {
    rootNavigationRef.reset({
      index: 0,
      routes: [{ name: 'Modal', state: { routes: [{ name: ForceUpdateRouteName }] } }],
    })
  }
}
