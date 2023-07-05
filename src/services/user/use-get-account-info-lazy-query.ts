import { useCallback } from 'react'
import { cdcApi } from '../api/cdc-api'

export const useGetAccountInfoLazyQuery = () => {
  const [executeWithRegTokenUnsigned] = cdcApi.useLazyAccountsGetAccountInfoWithRegTokenUnsignedQuery()
  const [executeSigned] = cdcApi.useLazyAccountsGetAccountInfoSignedQuery()

  const getAccountInfoLazyQuery = useCallback(
    (currentRegToken?: string) => {
      if (currentRegToken) {
        return executeWithRegTokenUnsigned({ regToken: currentRegToken })
      } else {
        return executeSigned()
      }
    },
    [executeWithRegTokenUnsigned, executeSigned],
  )

  return getAccountInfoLazyQuery
}
