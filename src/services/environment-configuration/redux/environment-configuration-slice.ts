import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EnvironmentConfiguration, environmentConfigurations } from '../environment-configuration'

export type EnvironmentConfigurationState = {
  currentEnvironment: EnvironmentConfiguration
}

export const environmentConfigurationInitialState: EnvironmentConfigurationState = {
  currentEnvironment: environmentConfigurations.data[0],
}

export const environmentConfigurationSlice = createSlice({
  name: 'environmentConfiguration',
  initialState: environmentConfigurationInitialState,
  reducers: {
    setEnvironmentConfiguration: (state, action: PayloadAction<string>) => {
      const environment = environmentConfigurations.data.find(env => env.name === action.payload)
      if (!environment) {
        const message = `Environment Configuration ${action.payload} not found."
          + "This error should not happen, please be sure to build the app correctly`
        console.error(message)
        throw new Error(message)
      }
      state.currentEnvironment = environment
    },
  },
})

export const { setEnvironmentConfiguration } = environmentConfigurationSlice.actions
