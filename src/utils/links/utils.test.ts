import { Linking } from 'react-native'
import { openLink, sendMail } from './utils'

describe('Links Utils', () => {
  describe('openLink', () => {
    test('should open link', async () => {
      const canOpenUrl = jest.spyOn(Linking, 'canOpenURL').mockImplementation(_url => Promise.resolve(true))
      const openUrl = jest.spyOn(Linking, 'openURL').mockImplementation(_url => Promise.resolve())

      const testUrl = 'https://test.url.com'
      await openLink('https://test.url.com')
      expect(canOpenUrl).toBeCalledWith(testUrl)
      expect(openUrl).toBeCalledWith(testUrl)
    })
  })

  describe('sendMail', () => {
    test('should open mailto link with correct params', async () => {
      const canOpenUrl = jest.spyOn(Linking, 'canOpenURL').mockImplementation(_url => Promise.resolve(true))
      const openUrl = jest.spyOn(Linking, 'openURL').mockImplementation(_url => Promise.resolve())

      await sendMail('test@test.com', 'testsubject', 'testbody')

      const expectedMailLink = 'mailto:test@test.com?subject=testsubject&body=testbody'

      expect(canOpenUrl).toBeCalledWith(expectedMailLink)
      expect(openUrl).toBeCalledWith(expectedMailLink)
    })
  })
})
