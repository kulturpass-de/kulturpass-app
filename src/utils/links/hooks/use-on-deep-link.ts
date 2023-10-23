import { useEffect, useState } from 'react'
import { Linking } from 'react-native'

export const useOnDeepLink = (callback: (url: URL) => Promise<void>) => {
  const [deepLink, setDeepLink] = useState<undefined | URL>()

  useEffect(() => {
    if (deepLink === undefined) {
      Linking.getInitialURL().then(url => {
        if (url !== null) {
          setDeepLink(new URL(url))
        }
      })
    }
  }, [deepLink])

  useEffect(() => {
    const subscription = Linking.addEventListener('url', e => setDeepLink(new URL(e.url)))
    return subscription.remove
  }, [])

  useEffect(() => {
    if (deepLink !== undefined) {
      callback(deepLink)
    }
  }, [callback, deepLink])
}
