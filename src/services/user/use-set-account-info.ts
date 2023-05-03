import { cdcApi } from '../api/cdc-api'
import { AccountsSetAccountInfoSignedRequestParams } from '../api/types'

export const useSetAccountInfo = (regToken?: string) => {
  const [setAccountInfoSigned] = cdcApi.useAccountsSetAccountInfoSignedMutation()
  const [setAccountWithRegTokenUnsigned] = cdcApi.useAccountsSetAccountInfoWithRegTokenUnsignedMutation()

  const setAccountInfo = async (params: AccountsSetAccountInfoSignedRequestParams) => {
    if (regToken) {
      return setAccountWithRegTokenUnsigned({ ...params, regToken }).unwrap()
    } else {
      return setAccountInfoSigned(params).unwrap()
    }
  }

  return setAccountInfo
}
