import { Platform } from 'react-native'
import { major, minor, patch } from 'semver'
import pkg from '../../../package.json'

export const userAgent: string = `${pkg.name}/${major(pkg.version)}.${minor(pkg.version)}.${patch(pkg.version)} (${
  Platform.OS === 'ios' ? 'iOS' : 'Android'
})`
