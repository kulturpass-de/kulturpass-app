import { logToBridge } from '../utils'

export const setWebviewPadding = (contentOffset: number) => {
  if (typeof contentOffset !== 'number') {
    return
  }
  document.body.style.paddingTop = `${contentOffset}px`

  try {
    // prevent ui issue where the content offset causes an empty space when switching
    // screen reader on and off, if the user scrolled already
    window.scroll(window.scrollX, window.scrollY - 1)
  } catch (error) {
    logToBridge('error', ['Scrolling failed', JSON.stringify(error)])
  }
}
