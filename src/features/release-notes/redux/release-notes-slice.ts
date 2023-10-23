import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ReleaseNotesState } from '../../../services/redux/versions/current'

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
