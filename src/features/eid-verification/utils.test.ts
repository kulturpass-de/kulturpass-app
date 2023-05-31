import { generateSimulatedCard } from './utils'

describe('generateSimulatedCard', () => {
  test('should create a card with a date and random lastname postfix', () => {
    const newDate = new Date(2005, 6, 13)
    const generatedSimulator = generateSimulatedCard('mustermannanna20050504', newDate, true)

    const dob = generatedSimulator.files.find(file => file.fileId === '0108' && file.shortFileId === '08')
    expect(dob?.content).toBe('680a12083230303530373133')

    const lastName = generatedSimulator.files.find(file => file.fileId === '0105' && file.shortFileId === '05')
    expect(lastName?.content !== '650c0c0a4d55535445524d414e4e').toBe(true)
    expect(lastName?.content.length! === '650c0c0a4d55535445524d414e4e'.length).toBe(true)
  })
})
