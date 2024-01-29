export const setWebviewTextZoom = (zoom: number) => {
  if (typeof zoom !== 'number') {
    return
  }
  document.body.style['-webkit-text-size-adjust'] = `${zoom}%`
}
