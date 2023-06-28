import type { ChildNode, Element as ElementNode, Text as TextNode } from 'domhandler/lib/node'
import { ElementType, parseDocument } from 'htmlparser2'
import React, { useCallback } from 'react'
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'
import { useTranslation } from '../../services/translation/translation'

import { openLink } from '../../utils/links/utils'

type InlineTextLinkProps = {
  text: string
  link: string
  textStyle?: StyleProp<TextStyle>
}
const InlineTextLink: React.FC<InlineTextLinkProps> = ({ text, link, textStyle }) => {
  const { t } = useTranslation()
  const handlePress = useCallback(() => openLink(link), [link])

  return (
    <Text
      style={[textStyle, styles.linkText]}
      accessible
      accessibilityLabel={text}
      accessibilityRole="link"
      accessibilityHint={t('external_link_short_accessibility_announcement')}
      onPress={handlePress}>
      {text}
    </Text>
  )
}

const sanitizeHtml = (text: string) => {
  return text.replace(/<br \/>/g, '\n').replace(/<br>/g, '\n')
}

type HtmlTextProps = {
  testID: string
  style: StyleProp<TextStyle>
  html: string
}

export const HtmlText: React.FC<HtmlTextProps> = ({ html, testID, style }) => {
  const renderTextNode = (textNode: TextNode, key: string, textStyle?: StyleProp<TextStyle>) => {
    const text = textNode.data
    return (
      <Text key={key} style={textStyle}>
        {text}
      </Text>
    )
  }

  const renderInlineLink = (textNode: TextNode, key: string, textStyle?: StyleProp<TextStyle>) => {
    const text = textNode.data
    let link: string = ''

    if (textNode.parent && textNode.parent.type === ElementType.Tag) {
      link = textNode.parent?.attribs?.href
    }

    return <InlineTextLink key={key} text={text} link={link} textStyle={textStyle} />
  }

  const renderElement = (element: ElementNode, key: string, textStyle?: StyleProp<TextStyle>) => {
    if (element.children.length === 1) {
      const elementKey = key + '-0'

      if (element.children[0].type === ElementType.Text) {
        switch (element.name) {
          case 'b':
            return renderTextNode(element.children[0], elementKey, [textStyle, styles.boldText])
          case 'i':
            return renderTextNode(element.children[0], elementKey, [textStyle, styles.italicText])
          case 'a':
            return renderInlineLink(element.children[0], elementKey + '-0', textStyle)
        }
      }
    }

    // nested text groups need a container
    return <Text key={key}>{element.children.map((c, i: number) => renderNode(c, `child-${i}`, textStyle))}</Text>
  }

  const renderNode = (node: ChildNode, index: string, textStyle?: StyleProp<TextStyle>) => {
    switch (node.type) {
      case ElementType.Text:
        return renderTextNode(node, index, textStyle)
      case ElementType.Tag:
        return renderElement(node, index, textStyle)
    }
    return null
  }

  const sanitizedHtml = sanitizeHtml(html)
  const document = parseDocument(sanitizedHtml)

  if (document.children.length === 0) {
    return (
      <Text testID={testID} style={style}>
        {sanitizedHtml}
      </Text>
    )
  }

  if (document.children.length === 1) {
    return renderNode(document.children[0], '0', style)
  }

  return (
    <Text testID={testID} style={style}>
      {document.children.map((c, i) => renderNode(c, 'sub' + i, style))}
    </Text>
  )
}

const styles = StyleSheet.create({
  boldText: { fontWeight: '700' },
  // TODO: extract textStyles below
  linkText: { textDecorationLine: 'underline' },
  italicText: { fontStyle: 'italic' },
})
