import { Platform } from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import { getCdcSessionData } from '../../../../services/auth/store/auth-selectors'
import { getCurrentEnvironmentConfigurationName } from '../../../../services/environment-configuration/redux/environment-configuration-selectors'
import { getEnvironmentConfig } from '../../../../services/environment-configuration/utils'
import { UnknownError } from '../../../../services/errors/errors'
import { createThunk } from '../../../../services/redux/utils/create-thunk'
import { getAccountInfo } from '../../../../services/user/redux/thunks/get-account-info'
import { errorCodeToAA2Error } from '../../errors'

export const startBankIdFlow = createThunk<void, string>('bankId/startBankIdFlow', async (bankCode, thunkAPI) => {
  // 1. Fetch new id_token
  const sessionData = getCdcSessionData(thunkAPI.getState())
  if (sessionData === null) {
    throw new UnknownError('sessionData is null')
  }

  const { id_token } = await thunkAPI.dispatch(getAccountInfo({ regToken: sessionData.regToken })).unwrap()

  if (id_token === undefined) {
    throw new UnknownError('id_token is undefined')
  }

  // 2. Create Bank Login URL
  const envConfigName = getCurrentEnvironmentConfigurationName(thunkAPI.getState())
  const { bankId, commerce } = getEnvironmentConfig(envConfigName)
  const loginUrl = `${bankId.loginUrl}?agent=app&blz=${bankCode}&idToken=${id_token}`

  // 3. Open Bank Login URL in InAppBrowser
  if (!(await InAppBrowser.isAvailable())) {
    throw new UnknownError('IAP_UNAVAILABLE')
  }

  const scheme = 'kulturpass'
  // Android needs a specific path, iOS doesn't
  const commerceHost = new URL(commerce.homeUrl).host
  const callbackUrl = Platform.OS === 'android' ? `${scheme}://${commerceHost}` : `${scheme}://`
  const result = await InAppBrowser.openAuth(loginUrl, callbackUrl, {
    ephemeralWebSession: true,
    showTitle: false,
    enableUrlBarHiding: true,
    enableDefaultShare: false,
    showInRecents: false,
  })

  if (typeof result !== 'object' || typeof result.type !== 'string') {
    throw new UnknownError('IAP_RESULT_INVALID')
  }

  // 4. Parse Bank Login Result
  if (result.type !== 'success') {
    throw new UnknownError('IAP_DISMISSED')
  }

  if (typeof result.url !== 'string') {
    throw new UnknownError('RESULT_URL_INVALID')
  }

  const searchQuery = result.url.includes('?') ? result.url.substring(result.url.indexOf('?') + 1) : ''
  const searchParams = new URLSearchParams(searchQuery)

  const popup = searchParams.get('popup')
  if (popup === 'IDENTITY_VERIFICATION_COMPLETION') {
    return
  } else if (popup === 'IDENTITY_VERIFICATION_ERROR') {
    const errorCode = searchParams.get('errorCode')
    if (errorCode === null) {
      throw new UnknownError('NO_ERROR_CODE')
    } else {
      throw errorCodeToAA2Error(errorCode)
    }
  } else {
    throw new UnknownError('UNKNOWN_POPUP')
  }
})
