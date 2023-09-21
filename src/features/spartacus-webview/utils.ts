export const isHeaderShown = (url: string) => {
  const path: undefined | string = url.split('?')?.[0]
  return path === '/' || path?.startsWith('/homepage')
}

export const isRoutedToLogin = (url: string) => {
  return url.startsWith('/login')
}
