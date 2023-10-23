import fs from 'fs'

const translation_folder = './src/services/translation/i18n/'

const languages = ['de', 'en']

const languageFiles = languages.map(lang => JSON.parse(fs.readFileSync(translation_folder + lang + '.json', 'utf8')))

/**
 * Go through all translation files and check, if all keys are found in the other translations.
 * This might help finding incosistencies in the translation files.
 */
for (let i = 0; i < languages.length; i++) {
  const lang = languages[i]
  const langObj = languageFiles[i]

  for (let j = 0; j < languages.length; j++) {
    const otherLang = languages[j]
    const otherLangObj = languageFiles[j]

    for (const key of Object.keys(langObj)) {
      if (otherLangObj[key] === undefined) {
        console.log(`Key ${key} was found for ${lang} but not for ${otherLang}`)
      }
    }
  }
}
