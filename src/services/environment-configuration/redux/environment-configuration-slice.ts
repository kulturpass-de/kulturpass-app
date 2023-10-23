import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { environmentConfigurations } from '../environment-configuration'

export type EnvironmentConfigurationState = {
  currentEnvironmentName: string
}

export const environmentConfigurationInitialState: EnvironmentConfigurationState = {
  currentEnvironmentName: environmentConfigurations.data[0].name,
}

export const environmentConfigurationSlice = createSlice({
  name: 'environmentConfiguration',
  initialState: environmentConfigurationInitialState,
  reducers: {
    setEnvironmentConfiguration: (state, action: PayloadAction<string>) => {
      if (environmentConfigurations.data.length === 0) {
        const message = `No Environment Configuration found."
        + "This error should not happen, please be sure to build the app correctly`
        console.error(message)
        throw new Error(message)
      }

      const environment = environmentConfigurations.data.find(env => env.name === action.payload)
      if (!environment) {
        state.currentEnvironmentName = environmentConfigurations.data[0].name
      } else {
        state.currentEnvironmentName = action.payload
      }
    },
  },
})

export const { setEnvironmentConfiguration } = environmentConfigurationSlice.actions
