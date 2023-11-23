import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { cdcApi } from '../api/cdc-api'
import { getCdcSessionData, getIsUserLoggedIn } from '../auth/store/auth-selectors'

export const useGetAccountInfo = (regToken?: string) => {
  const isLoggedIn = useSelector(getIsUserLoggedIn)

  const [executeWithRegTokenUnsigned, dataWithRegTokenUnsigned] =
    cdcApi.useLazyAccountsGetAccountInfoWithRegTokenUnsignedQuery()
  const [executeSigned, dataSigned] = cdcApi.useLazyAccountsGetAccountInfoSignedQuery()

  const cdcSessionData = useSelector(getCdcSessionData)
  regToken = regToken || cdcSessionData?.regToken

  const refetchAccountInfo = useCallback(() => {
    if (regToken) {
      executeWithRegTokenUnsigned({ regToken })
    } else if (isLoggedIn) {
      executeSigned()
    }
  }, [executeSigned, executeWithRegTokenUnsigned, isLoggedIn, regToken])

  useEffect(() => {
    refetchAccountInfo()
  }, [refetchAccountInfo])

  const accountInfo = useMemo(() => {
    if (regToken) {
      return dataWithRegTokenUnsigned
    } else {
      return dataSigned
    }
  }, [regToken, dataWithRegTokenUnsigned, dataSigned])

  return { accountInfo, refetchAccountInfo }
}
