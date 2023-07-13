import { Linking } from 'react-native'
import strictUriEncode from 'strict-uri-encode'

export const openLink = async (link: string) => {
  try {
    if (await Linking.canOpenURL(link)) {
      await Linking.openURL(link)
    } else {
      console.error('Link not supported by system', link)
    }
  } catch (e) {
    console.error('Failed opening the link', link)
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

  await openLink(link)
}
