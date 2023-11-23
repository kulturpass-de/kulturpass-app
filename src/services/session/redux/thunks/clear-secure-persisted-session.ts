import { createThunk } from '../../../redux/utils/create-thunk'
import { clearCdcSession, clearCommerceSession, clearUserLocation } from '../../session-service'

export const clearSecurePersistedSession = createThunk('session/clearSecurePersistedSession', async () => {
  await clearUserLocation()
  await clearCdcSession()
  await clearCommerceSession()
})
