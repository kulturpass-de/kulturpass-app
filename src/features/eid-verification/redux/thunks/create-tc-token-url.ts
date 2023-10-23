import { getCdcSessionData } from '../../../../services/auth/store/auth-selectors'
import { getCurrentEnvironmentConfigurationName } from '../../../../services/environment-configuration/redux/environment-configuration-selectors'
import { getEnvironmentConfig } from '../../../../services/environment-configuration/utils'
import { UnknownError } from '../../../../services/errors/errors'
import { selectTcTokenUrlSubdomains } from '../../../../services/redux/slices/persisted-app-core'
import { createThunk } from '../../../../services/redux/utils/create-thunk'
import { getAccountInfo } from '../../../../services/user/redux/thunks/get-account-info'

export const createTcTokenUrl = createThunk<string, void>('eid/createTcTokenUrl', async (_payload, thunkAPI) => {
  // 1. Fetch new id_token
  const sessionData = getCdcSessionData(thunkAPI.getState())
  if (sessionData === null) {
    throw new UnknownError('sessionData is null')
  }

  const { id_token } = await thunkAPI.dispatch(getAccountInfo({ regToken: sessionData.regToken })).unwrap()

  if (id_token === undefined) {
    throw new UnknownError('id_token is undefined')
  }

  // 2. Create base token URL
  const tcTokenUrlSubdomains = selectTcTokenUrlSubdomains(thunkAPI.getState())
  const envConfigName = getCurrentEnvironmentConfigurationName(thunkAPI.getState())
  const { eid } = getEnvironmentConfig(envConfigName)

  let tcTokenSubdomain: string
  // Filter for valid domain names
  const filteredSubdomains = tcTokenUrlSubdomains?.filter(dom => dom.match(/^[A-Za-z0-9-_]+$/) !== null)

  if (filteredSubdomains !== undefined && filteredSubdomains.length !== 0) {
    const randomIndex = Math.round(Math.random() * (filteredSubdomains.length - 1))
    tcTokenSubdomain = filteredSubdomains[randomIndex]
  } else {
    // If no valid domain was found, use default from env config
    tcTokenSubdomain = eid.tcTokenUrlDefaultSubdomain
  }

  const baseTokenUrl = eid.tcTokenUrl.replace('%s', tcTokenSubdomain)

  // 3. Join everything together
  const tokenUrl = `${baseTokenUrl}?idToken=${id_token}`
  return tokenUrl
})
