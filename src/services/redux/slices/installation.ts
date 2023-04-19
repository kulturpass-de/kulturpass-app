import { createSelector, createSlice } from '@reduxjs/toolkit'

import { RootState } from './../configure-store'

export type InstallationState = {
  installed: boolean
}

export const initialState: InstallationState = {
  installed: false,
}

export const installationSlice = createSlice({
  name: 'installation',
  initialState,
  reducers: {
    setInstalled: state => {
      state.installed = true
    },
  },
})

const installationState = (state: RootState) => state.persisted.installation

export const isAppInstalled = createSelector(installationState, installation => installation.installed)
