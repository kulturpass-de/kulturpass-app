import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ReleaseNotesState = {
  lastDisplayedVersion: string
}

const initialState: ReleaseNotesState = {
  lastDisplayedVersion: '',
}

export const releaseNotesSlice = createSlice({
  name: 'releaseNotes',
  initialState,
  reducers: {
    setLastDisplayedVersion: (state, action: PayloadAction<string>) => {
      state.lastDisplayedVersion = action.payload
    },
  },
})

export const { setLastDisplayedVersion } = releaseNotesSlice.actions
