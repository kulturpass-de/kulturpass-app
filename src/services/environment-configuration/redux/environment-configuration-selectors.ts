import { createSelector } from '@reduxjs/toolkit'

import type { RootState } from '../../redux/configure-store'

export const getEnvironmentConfigurationState = (state: RootState) => state.persisted.environmentConfiguration

export const getCurrentEnvironmentConfiguration = createSelector(
  getEnvironmentConfigurationState,
  state => state.currentEnvironment,
)

export const getEnvironmentConfigurationCdc = createSelector(getCurrentEnvironmentConfiguration, state => state.cdc)

export const getEnvironmentConfigurationCommerce = createSelector(
  getCurrentEnvironmentConfiguration,
  state => state.commerce,
)

export const getCommerceBaseSiteId = createSelector(getEnvironmentConfigurationCommerce, state => {
  return state.baseSiteId
})

export const getCommerceBaseUrl = createSelector(getEnvironmentConfigurationCommerce, commerce => commerce.baseUrl)

export const getCommerceHomeUrl = createSelector(getEnvironmentConfigurationCommerce, commerce => commerce.homeUrl)

export const getCommerceSearchUrl = createSelector(getEnvironmentConfigurationCommerce, commerce => commerce.searchUrl)

export const getCdcDpsDocumentUrl = createSelector(getEnvironmentConfigurationCdc, cdc => cdc.consents.dpsDocumentUrl)
