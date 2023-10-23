import { translation } from '../../translation/translation'
import { AppStore } from '../configure-store'
import { appCoreSlice } from '../slices/app-core'

export const subscribeToTranslationLanguageChanged = (store: AppStore['store']) => {
  translation.on('languageChanged', language => {
    store.dispatch(appCoreSlice.actions.setLastUsedTranslationLanguage(language))
  })
}
