import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { simulationCards } from '../../../screens/developer-settings/simulation-cards/simulation-cards'

export type CardSimulationState = {
  simulateCard: boolean
  simulatedCardName?: keyof typeof simulationCards
}

export const cardSimulationInitialState: CardSimulationState = {
  simulateCard: false,
  simulatedCardName: undefined,
}

export const cardSimulationSlice = createSlice({
  name: 'cardSimulation',
  initialState: cardSimulationInitialState,
  reducers: {
    setSimulateCard: (state, action: PayloadAction<boolean>) => {
      state.simulateCard = action.payload
    },
    setSimulatedCardName: (state, action: PayloadAction<keyof typeof simulationCards>) => {
      state.simulatedCardName = action.payload
    },
  },
})

export const { setSimulateCard, setSimulatedCardName } = cardSimulationSlice.actions
