import { Linking } from 'react-native'
import { ErrorAlertManager } from '../../services/errors/error-alert-provider'
import { LinkError } from './errors'
import { openLink, sendMail } from './utils'

jest.mock('../../services/errors/error-alert-provider', () => ({
  ErrorAlertManager: {
    current: {
      showError: jest.fn(),
    },
  },
}))

describe('Links Utils', () => {
  describe('openLink', () => {
    test('should open link', async () => {
      const canOpenUrl = jest.spyOn(Linking, 'canOpenURL').mockImplementation(_url => Promise.resolve(true))
      const openUrl = jest.spyOn(Linking, 'openURL').mockImplementation(_url => Promise.resolve())

      const testUrl = 'https://test.url.com'
      await openLink(testUrl)
      expect(canOpenUrl).toBeCalledWith(testUrl)
      expect(openUrl).toBeCalledWith(testUrl)
    })

    test('should throw LinkError if system cannot open the link', async () => {
      const canOpenUrl = jest.spyOn(Linking, 'canOpenURL').mockImplementation(_url => Promise.resolve(true))
      const openUrl = jest.spyOn(Linking, 'openURL').mockImplementation(_url => Promise.reject())

      const testUrl = 'https://test.url.com'
      await expect(openLink(testUrl)).rejects.toBeInstanceOf(LinkError)

      expect(canOpenUrl).toBeCalledWith(testUrl)
      expect(openUrl).toBeCalledWith(testUrl)
    })

    test('should throw LinkError if system fails opening the link', async () => {
      const canOpenUrl = jest.spyOn(Linking, 'canOpenURL').mockImplementation(_url => Promise.resolve(false))

      const testUrl = 'https://test.url.com'
      await expect(openLink(testUrl)).rejects.toBeInstanceOf(LinkError)

      expect(canOpenUrl).toBeCalledWith(testUrl)
    })
  })

  describe('sendMail', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    test('should open mailto link with correct params', async () => {
      const canOpenUrl = jest.spyOn(Linking, 'canOpenURL').mockImplementation(_url => Promise.resolve(true))
      const openUrl = jest.spyOn(Linking, 'openURL').mockImplementation(_url => Promise.resolve())

      await sendMail('test@test.com', 'testsubject', 'testbody')

      const expectedMailLink = 'mailto:test@test.com?subject=testsubject&body=testbody'

      expect(canOpenUrl).toBeCalledWith(expectedMailLink)
      expect(openUrl).toBeCalledWith(expectedMailLink)
    })

    test('should open error dialog if system cannot send the email', async () => {
      const canOpenUrl = jest.spyOn(Linking, 'canOpenURL').mockImplementation(_url => Promise.resolve(true))
      const openUrl = jest.spyOn(Linking, 'openURL').mockImplementation(_url => Promise.reject())

      await sendMail('test@test.com', 'testsubject', 'testbody')

      const expectedMailLink = 'mailto:test@test.com?subject=testsubject&body=testbody'

      expect(canOpenUrl).toBeCalledWith(expectedMailLink)
      expect(openUrl).toBeCalledWith(expectedMailLink)
      expect(ErrorAlertManager.current?.showError).toBeCalled()
    })

    test('should open error dialog if system fails sending the email', async () => {
      const canOpenUrl = jest.spyOn(Linking, 'canOpenURL').mockImplementation(_url => Promise.resolve(false))

      await sendMail('test@test.com', 'testsubject', 'testbody')

      const expectedMailLink = 'mailto:test@test.com?subject=testsubject&body=testbody'

      expect(canOpenUrl).toBeCalledWith(expectedMailLink)
      expect(ErrorAlertManager.current?.showError).toBeCalled()
    })
  })
})
