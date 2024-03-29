import { logToBridge } from '../utils'

export const webviewChangeTitle = (title: string) => {
  if (typeof title !== 'string') {
    logToBridge('error', ['Change title is not a string', title])
    return
  }

  try {
    // find the title
    const titleElement = document.querySelector('html head title')

    if (titleElement) {
      titleElement.textContent = title
      logToBridge('log', ['Changed title', title])
    } else {
      logToBridge('warn', ['Could not find html/head/title element'])
    }
  } catch (error: unknown) {
    logToBridge('error', ['Setting language failed', JSON.stringify(error)])
  }
}
