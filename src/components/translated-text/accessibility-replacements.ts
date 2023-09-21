import { removeHtmlTags } from '../../services/html-parser/html-parser'

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
