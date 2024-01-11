import { translation } from '../../translation/translation'
import { appendLanguageParameters } from './append-language-parameters'

describe('append-language-parameters', () => {
  it('should append lang property based on translation.language', async () => {
    await translation?.changeLanguage('de')

    const res = appendLanguageParameters({ irrelevantProperty: 'should remain as is' })

    expect(res).toHaveProperty('irrelevantProperty', 'should remain as is')
    expect(res).toHaveProperty('lang', 'de')
  })

  it('should overwrite lang property if it already exists', async () => {
    await translation?.changeLanguage('en')

    const res = appendLanguageParameters({ irrelevantProperty: 'should remain as is', lang: 'none' })

    expect(res).toHaveProperty('irrelevantProperty', 'should remain as is')
    expect(res).toHaveProperty('lang', 'en')
  })
})
