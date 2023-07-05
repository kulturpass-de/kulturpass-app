import { useSelector } from 'react-redux'
import { cdcApi } from '../api/cdc-api'
import { AccountsSetAccountInfoSignedRequestParams } from '../api/types'
import { getCdcSessionData } from '../auth/store/auth-selectors'

export const useSetAccountInfo = (regToken?: string) => {
  const [setAccountInfoSigned] = cdcApi.useAccountsSetAccountInfoSignedMutation()
  const [setAccountWithRegTokenUnsigned] = cdcApi.useAccountsSetAccountInfoWithRegTokenUnsignedMutation()

  const cdcSessionData = useSelector(getCdcSessionData)
  regToken = regToken || cdcSessionData?.regToken

  const setAccountInfo = async (params: AccountsSetAccountInfoSignedRequestParams) => {
    if (regToken) {
      return setAccountWithRegTokenUnsigned({ ...params, regToken }).unwrap()
    } else {
      return setAccountInfoSigned(params).unwrap()
    }
  }

  return setAccountInfo
}
