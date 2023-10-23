import { ComponentStory, ComponentMeta } from '@storybook/react-native'
import React from 'react'
import { ScrollView } from 'react-native'
import { colors } from '../../theme/colors'
import { textStyles } from '../../theme/typography'
import { HtmlText } from './html-text'

const basicHtml = `
<b>bold text</b>
<i>italic text</i>
regular linebreak
regular linebreak next line
br linebreak<br />br linebreak next line
<a href="http://www.sap.de">link to sap.de</a>
`

const productDescriptionExample1 = `
Ein Erlebnis wie kein anderes. Im Kino mit Popcorn schaut es sich einfach am Besten!

Wir bieten verschiedene Preiskategorien an:

<b>Loge</b>
<i>Unser bequemster Platz</i>

<b>Parkett</b>
<i>Preiswerteste Wahl</i>

Mehr Infos <a href='https://www.sap.de'>hier</a>!`

const productDescriptionExample2 = `<p><strong>Peter Orloff &amp; Schwarzmeer Kosaken-Chor</strong><br />
Es gibt viele Kosakenchöre, aber nur einen Schwarzmeer – Kosakenchor urteilte die WAZ. Das Konzert ist eine musikalische Reise durch die märchenhafte Welt des alten Russland mit Romanzen, Geschichten und Balladen von grandioser Ausdruckskraft, tiefer Melancholie und überschäumendem Temperament.<br />
<br />
Der berühmte Schwarzmeer Kosaken-Chor unter der musikalischen Gesamtleitung und persönlicher Mitwirkung von Peter Orloff, der einst vor über 50 Jahren als jüngster Sänger aller Kosakenchöre der Welt seine legendäre Karriere begründete, ist wieder auf Europa-Tournee.<br />
<br />
<strong>Wertcode für ein Touch Konzert</strong><br />
<br />
<a href="https://www.touch-band.rocks" rel="nofollow noreferrer" target="_blank">Https Link 1</a><br />
Line1<br />
<br />
Line2<br />
<a href="https://www.touch-band.rocks" rel="nofollow noreferrer" target="_blank">Https Link 2</a><br />
<br />
<em>Line3</em><br />
<a href="https://www.touch-band.rocks" rel="nofollow noreferrer" target="_blank">Https Link</a><br />
<br />
<br />
<strong>Test</strong></p>`

const componentMeta: ComponentMeta<typeof HtmlText> = {
  title: 'HtmlText',
  component: HtmlText,
  args: {
    testID: 'some-test-id',
    style: { ...textStyles.BodyRegular, color: colors.moonDarkest },
    html: basicHtml,
  },
}

export default componentMeta

export const Basic: ComponentStory<typeof HtmlText> = args => (
  <ScrollView>
    <HtmlText {...args} />
  </ScrollView>
)
export const ProductDescription1: ComponentStory<typeof HtmlText> = args => (
  <ScrollView>
    <HtmlText {...args} html={productDescriptionExample1} />
  </ScrollView>
)
export const ProductDescription2: ComponentStory<typeof HtmlText> = args => (
  <ScrollView>
    <HtmlText {...args} html={productDescriptionExample2} />
  </ScrollView>
)
