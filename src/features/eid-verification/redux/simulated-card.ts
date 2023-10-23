import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { simulationCards } from '../../../screens/developer-settings/simulation-cards/simulation-cards'

export type CardSimulationState = {
  simulateCard: boolean
  simulatedCardName?: keyof typeof simulationCards
  simulatedCardDate?: string
  randomLastName?: boolean
}

export const cardSimulationInitialState: CardSimulationState = {
  simulateCard: false,
  simulatedCardName: undefined,
  simulatedCardDate: undefined,
  randomLastName: undefined,
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
    setSimulatedCardDate: (state, action: PayloadAction<string | undefined>) => {
      state.simulatedCardDate = action.payload
    },
    setRandomLastName: (state, action: PayloadAction<boolean>) => {
      state.randomLastName = action.payload
    },
  },
})

export const { setSimulateCard, setSimulatedCardName, setSimulatedCardDate, setRandomLastName } =
  cardSimulationSlice.actions
