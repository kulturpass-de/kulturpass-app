import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GeoPosition } from 'react-native-geolocation-service'
import { LocationState } from '../../redux/versions/current'

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
