import { useEffect, useMemo } from 'react'
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

  useEffect(() => {
    if (regToken) {
      executeWithRegTokenUnsigned({ regToken })
    } else if (isLoggedIn) {
      executeSigned()
    }
  }, [executeSigned, executeWithRegTokenUnsigned, isLoggedIn, regToken])

  const data = useMemo(() => {
    if (regToken) {
      return dataWithRegTokenUnsigned
    } else {
      return dataSigned
    }
  }, [regToken, dataWithRegTokenUnsigned, dataSigned])

  return data
}
