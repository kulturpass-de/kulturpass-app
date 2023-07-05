import { render, screen } from '@testing-library/react-native'
import React from 'react'
import { colors } from '../../theme/colors'
import { textStyles } from '../../theme/typography'
import { HtmlText } from './html-text'

const renderHtmlText = (html: string) => {
  render(
    <HtmlText testID={'some-test-ID'} style={{ ...textStyles.BodyRegular, color: colors.moonDarkest }} html={html} />,
  )
}

describe('HtmlText', () => {
  it('returns a pure text string wrapped into a text element', () => {
    const input = 'hello world'
    renderHtmlText(input)
    expect(screen.toJSON()).toMatchSnapshot()
  })
  it('replaces a <b> tag', () => {
    const input = '<b>bold</b>'
    renderHtmlText(input)
    expect(screen.toJSON()).toMatchSnapshot()
  })
  it('replaces a <b> tag with preluding text', () => {
    const input = 'hello <b>bold world</b>'
    renderHtmlText(input)
    expect(screen.toJSON()).toMatchSnapshot()
  })
  it('replaces a <i> tag', () => {
    const input = '<i>italic</i>'
    renderHtmlText(input)
    expect(screen.toJSON()).toMatchSnapshot()
  })
  it('replaces a <i> tag with preluding text', () => {
    const input = 'hello <i>italic world</i>'
    renderHtmlText(input)
    expect(screen.toJSON()).toMatchSnapshot()
  })
  it('replaces html entities', () => {
    const input = 'hell&ouml;&auml;&szlig;'
    renderHtmlText(input)
    expect(screen.toJSON()).toMatchSnapshot()
  })
  it('replaces all html entities', () => {
    const input = 'hell&ouml;&auml;&szlig;Lgt;&gt;'
    renderHtmlText(input)
    expect(screen.toJSON()).toMatchSnapshot()
  })
  it('replaces &lgt; &gt; with < and >', () => {
    const input = 'Bigger &gt; smaller &lt;'
    renderHtmlText(input)
    expect(screen.toJSON()).toMatchSnapshot()
  })
  it('replaces links which are opened in an external browser', () => {
    const input = '<a href="http://www.somewhere.de/somelink">linktext</a>'
    renderHtmlText(input)
    expect(screen.toJSON()).toMatchSnapshot()
  })
  it('filters out any other html', () => {
    const input = 'hack attack: <script>/* hack attack *?</script>'
    renderHtmlText(input)
    expect(screen.toJSON()).toMatchSnapshot()
  })
  it('replaces a <br /> with a linkebreak', () => {
    const input = 'line 1<br />line2'
    renderHtmlText(input)
    expect(screen.toJSON()).toMatchSnapshot()
  })
  it('keeps \n linkebreaks', () => {
    const input = 'line 1\nline2'
    renderHtmlText(input)
    expect(screen.toJSON()).toMatchSnapshot()
  })
  it('replaces a complex product description', () => {
    const input = `
      Ein Erlebnis wie kein anderes. Im Kino mit Popcorn schaut es sich einfach am Besten!

      Wir bieten verschiedene Preiskategorien an:

      <b>Loge</b>
      <i>Unser bequemster Platz</i>

      <b>Parkett</b>
      <i>Preiswerteste Wahl</i>

      Mehr Infos <a href='https://www.sap.de'>hier</a>!`
    renderHtmlText(input)
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('ignores simple unclosed tags', () => {
    const input = 'Hello <b world'
    renderHtmlText(input)
    expect(screen.toJSON()).toMatchSnapshot()
  })
  it('doesnt throw an error and still renders something if html invalid', () => {
    const input = 'Hello <b wo<script>rld<i><script italic</i>'
    renderHtmlText(input)
    expect(screen.toJSON()).toMatchSnapshot()
  })
})
