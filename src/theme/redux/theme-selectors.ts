import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../../services/redux/configure-store'

export const getThemeState = (state: RootState) => state.theme

export const getDarkThemePreviewEnabled = createSelector(getThemeState, state => state.darkThemePreviewEnabled)

export const getForcedTheme = createSelector(getThemeState, state => state.forcedTheme)
