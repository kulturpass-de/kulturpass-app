import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ThemeState = {
  darkThemePreviewEnabled: boolean
  forcedTheme: 'light' | 'dark' | null
}

export const themeInitialState: ThemeState = {
  darkThemePreviewEnabled: false,
  forcedTheme: null,
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState: themeInitialState,
  reducers: {
    setDarkThemePreviewEnabled: (state, action: PayloadAction<boolean>) => {
      state.darkThemePreviewEnabled = action.payload
    },
    setForcedTheme: (state, action: PayloadAction<ThemeState['forcedTheme']>) => {
      state.forcedTheme = action.payload
    },
  },
})

export const { setDarkThemePreviewEnabled, setForcedTheme } = themeSlice.actions
