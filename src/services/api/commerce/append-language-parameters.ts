import { translation } from '../../translation/translation'

export const appendLanguageParameters = <InputData>(inputData: InputData) => {
  /**
   * the query parameter lang shall be appended to url with its value set as follows:
   *  - if the app language is German, set to de
   *  - otherwise, set to en
   */
  return { ...inputData, lang: translation.language === 'de' ? 'de' : 'en' }
}
