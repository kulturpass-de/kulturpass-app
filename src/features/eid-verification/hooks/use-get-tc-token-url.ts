import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { getCdcSessionData } from '../../../services/auth/store/auth-selectors'
import { useEnvironmentConfiguration } from '../../../services/environment-configuration/hooks/use-environment-configuration'
import { UnknownError } from '../../../services/errors/errors'
import { RootState } from '../../../services/redux/configure-store'
import { useGetAccountInfoLazyQuery } from '../../../services/user/use-get-account-info-lazy-query'

export const useGetTcTokenUrl = () => {
  const sessionData = useSelector(getCdcSessionData)
  const eidEnv = useEnvironmentConfiguration().eid

  const tcTokenUrlSubdomains = useSelector(
    (state: RootState) => state.persisted.persistedAppCore.appConfig?.eid.tcTokenUrlSubdomains,
  )
  const getAccountInfoLazyQuery = useGetAccountInfoLazyQuery()

  return useCallback(async () => {
    // Fetch new id_token
    if (sessionData === null) {
      throw new UnknownError()
    }

    const data = await getAccountInfoLazyQuery(sessionData.regToken)

    if (data?.id_token === undefined) {
      throw new UnknownError()
    }

    // Create base token URL
    let tcTokenSubdomain: string
    const filteredSubdomains = tcTokenUrlSubdomains?.filter(dom => dom.match(/^[A-Za-z0-9-_]+$/) !== null)
    if (filteredSubdomains !== undefined && filteredSubdomains.length !== 0) {
      const randomIndex = Math.round(Math.random() * (filteredSubdomains.length - 1))
      tcTokenSubdomain = filteredSubdomains[randomIndex]
    } else {
      tcTokenSubdomain = eidEnv.tcTokenUrlDefaultSubdomain
    }

    const baseTokenUrl = eidEnv.tcTokenUrl.replace('%s', tcTokenSubdomain)

    // Join everything together
    const tokenUrl = `${baseTokenUrl}?idToken=${data.id_token}`
    return tokenUrl
  }, [eidEnv.tcTokenUrl, eidEnv.tcTokenUrlDefaultSubdomain, getAccountInfoLazyQuery, sessionData, tcTokenUrlSubdomains])
}
