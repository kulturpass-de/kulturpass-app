export const setWebviewPadding = (contentOffset: number) => {
  if (typeof contentOffset !== 'number') {
    return
  }
  document.body.style.paddingTop = `${contentOffset}px`
}
