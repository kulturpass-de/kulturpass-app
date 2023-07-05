import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../redux/configure-store'

export const getEnvironmentConfigurationState = (state: RootState) => state.persisted.environmentConfiguration

export const getCurrentEnvironmentConfigurationName = createSelector(
  getEnvironmentConfigurationState,
  state => state.currentEnvironmentName,
)
