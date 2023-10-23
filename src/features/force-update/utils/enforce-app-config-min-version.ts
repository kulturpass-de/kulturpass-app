import { gt } from 'semver'
import pkg from '../../../../package.json'
import { rootNavigationRef } from '../../../navigation/navigation-container'
import { ForceUpdateRouteName } from '../../../screens/app/force-update-route'
import { AppConfig } from '../../../services/redux/versions/current'

export const enforceAppConfigMinVersion = (appConfig: AppConfig) => {
  if (gt(appConfig.appVersions.min, pkg.version)) {
    rootNavigationRef.reset({
      index: 0,
      routes: [{ name: 'Modal', state: { routes: [{ name: ForceUpdateRouteName }] } }],
    })
  }
}
