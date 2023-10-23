import * as htmlparser2 from 'htmlparser2'

const parseTags = () => {
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
}

const removeHtmlTags = parseTags()
const ElementType = htmlparser2.ElementType
const parseDocument = htmlparser2.parseDocument

export { removeHtmlTags, ElementType, parseDocument }
