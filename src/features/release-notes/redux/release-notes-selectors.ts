import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../../services/redux/configure-store'

const getReleaseNotesState = (state: RootState) => state.persisted.releaseNotes

export const getLastDisplayedVersion = createSelector(
  getReleaseNotesState,
  releaseNotes => releaseNotes.lastDisplayedVersion,
)
