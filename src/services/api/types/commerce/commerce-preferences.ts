import { Language } from '../../../translation/types'

export type PreferenceCategoryId = string

export type PreferenceCategory = {
  id: PreferenceCategoryId
  name: string
}

export type GetPreferenceCategoriesRequestParams = {
  baseSiteId: string
  lang: Language
}

export type GetPreferenceCategoriesResponse = {
  categories: PreferenceCategory[]
}
