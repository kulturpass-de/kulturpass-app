import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GeoPosition } from 'react-native-geolocation-service'

export type LocationState = {
  currentUserLocation: GeoPosition | undefined
}

export const locationInitialState: LocationState = {
  currentUserLocation: undefined,
}

export const locationSlice = createSlice({
  name: 'location',
  initialState: locationInitialState,
  reducers: {
    setCurrentUserLocation: (state, action: PayloadAction<GeoPosition | undefined>) => {
      state.currentUserLocation = action.payload
    },
  },
})

export const { setCurrentUserLocation } = locationSlice.actions
