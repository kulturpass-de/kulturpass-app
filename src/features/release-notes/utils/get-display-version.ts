import { major, minor } from 'semver'
import pkg from '../../../../package.json'

export const getDisplayVersion = (version = pkg.version) => `${major(version)}.${minor(version)}`
