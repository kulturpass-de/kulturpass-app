import { RootState } from '../../../services/redux/configure-store'

export const getSimulateCard = (reduxState: RootState) => reduxState.persisted.cardSimulation.simulateCard

export const getSimulatedCardName = (reduxState: RootState) => reduxState.persisted.cardSimulation.simulatedCardName

export const getSimulatedCardDate = (reduxState: RootState) => reduxState.persisted.cardSimulation.simulatedCardDate

export const getRandomLastName = (reduxState: RootState) => reduxState.persisted.cardSimulation.randomLastName
