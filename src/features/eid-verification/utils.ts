import { Simulator } from '@sap/react-native-ausweisapp2-wrapper'
import { simulationCards } from '../../screens/developer-settings/simulation-cards/simulation-cards'

export const generateSimulatedCard = (
  simulatedCardName: keyof typeof simulationCards,
  simulatedCardDate?: Date,
  randomLastName?: boolean,
) => {
  let simulatedCard: Simulator = {
    files:
      require('../../screens/developer-settings/simulation-cards/simulation-cards').simulationCards[
        simulatedCardName
      ] ?? [],
    keys: [],
  }

  if (simulatedCardDate !== undefined) {
    const month = simulatedCardDate.getMonth() + 1
    const dateOfBirth = `${simulatedCardDate.getFullYear()}${month.toString().padStart(2, '0')}${simulatedCardDate
      .getDate()
      .toString()
      .padStart(2, '0')}`
    const dateOfBirthHex = Buffer.from(dateOfBirth, 'utf-8').toString('hex')
    simulatedCard.files = simulatedCard.files.map(file => {
      if (file.fileId === '0108' && file.shortFileId === '08') {
        file.content = '680a1208' + dateOfBirthHex
      }
      return file
    })
  }

  if (randomLastName === true) {
    // Not really good randomness but okay for card simulation
    const randomStr = Math.random().toString(36).slice(2, 12)
    const randomStrHex = Buffer.from(randomStr, 'utf-8').toString('hex')
    simulatedCard.files = simulatedCard.files.map(file => {
      if (file.fileId === '0105' && file.shortFileId === '05') {
        file.content = '650c0c0a' + randomStrHex
      }
      return file
    })
  }
  return simulatedCard
}
