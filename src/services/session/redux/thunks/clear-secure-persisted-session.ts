import { createThunk } from '../../../redux/utils/create-thunk'
import { clearCdcSession, clearCommerceSession } from '../../session-service'

export const clearSecurePersistedSession = createThunk('session/clearSecurePersistedSession', async () => {
  await clearCdcSession()
  await clearCommerceSession()
})
