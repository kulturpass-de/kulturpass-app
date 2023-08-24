import { Linking } from 'react-native'
import strictUriEncode from 'strict-uri-encode'
import { ErrorAlertManager } from '../../services/errors/error-alert-provider'
import { LinkError, MailToError } from './errors'

export const openLink = async (link: string) => {
  try {
    if (await Linking.canOpenURL(link)) {
      await Linking.openURL(link)
    } else {
      throw new LinkError('Link not supported by system', link)
    }
  } catch (error: unknown) {
    throw new LinkError('Failed opening the link', link)
  }
}

export const sendMail = async (recipient: string, subject?: string, content?: string) => {
  let link = `mailto:${recipient}`

  if (subject) {
    link += `?subject=${strictUriEncode(subject)}`
  }

  if (content) {
    if (subject) {
      link += '&'
    } else {
      link += '?'
    }
    link += `body=${strictUriEncode(content)}`
  }

  try {
    await openLink(link)
  } catch (error: unknown) {
    ErrorAlertManager.current?.showError(new MailToError(recipient))
  }
}
