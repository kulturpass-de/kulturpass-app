import * as htmlparser2 from 'htmlparser2'

/**
 * TODO: Probably we should combine the following usage of `htmlparser2` and the functionalities of HtmlText component
 * into an "html parsing service"
 */
const removeHtmlTags = (() => {
  let text = ''

  const parser = new htmlparser2.Parser({
    ontext: input => {
      text += input
    },
  })

  const parse = (textToParse: string) => {
    text = ''
    parser.write(textToParse)
    return text
  }

  return parse
})()

const accessibilityReplacements = {
  '€': 'Euro',
}

const replacementKeys = Object.keys(accessibilityReplacements) as (keyof typeof accessibilityReplacements)[]

export const applyAccessibilityReplacements = (text: string) => {
  const textWithReplacements = replacementKeys.reduce((reducedText, replacementKey) => {
    while (reducedText.indexOf(replacementKey) > -1) {
      const replacement = accessibilityReplacements[replacementKey]
      reducedText = reducedText.replace(replacementKey, replacement)
    }

    return reducedText
  }, text)

  return removeHtmlTags(textWithReplacements)
}
