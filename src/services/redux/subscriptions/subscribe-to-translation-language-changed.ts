import { logger } from '../../logger'
import { translation } from '../../translation/translation'
import { AppStore } from '../configure-store'
import { persistedAppCoreSlice } from '../slices/persisted-app-core'

export const subscribeToTranslationLanguageChanged = (store: AppStore['store']) => {
  translation?.on('languageChanged', language => {
    logger.log('languageChanged, updating store', language)
    store.dispatch(persistedAppCoreSlice.actions.setLastUsedTranslationLanguage(language))
  })
}
