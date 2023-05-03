import { createSecureStorage } from '../storage/secure-storage'
import { CdcSessionData, CommerceSessionData } from './types'

export const sessionSecureStorage = createSecureStorage<{
  cdcSessionData: CdcSessionData | null
  commerceSessionData: CommerceSessionData | null
}>()

export const persistCdcSession = async (cdcSessionData: CdcSessionData) => {
  await sessionSecureStorage.setItem('cdcSessionData', cdcSessionData)
}

export const clearCdcSession = async () => {
  await sessionSecureStorage.removeItem('cdcSessionData')
}

export const getCdcSession = async () => {
  return await sessionSecureStorage.getItem('cdcSessionData')
}

export const persistCommerceSession = async (commerceSessionData: CommerceSessionData) => {
  await sessionSecureStorage.setItem('commerceSessionData', commerceSessionData)
}

export const getCommerceSession = async () => {
  return await sessionSecureStorage.getItem('commerceSessionData')
}

export const clearCommerceSession = async () => {
  await sessionSecureStorage.removeItem('commerceSessionData')
}
