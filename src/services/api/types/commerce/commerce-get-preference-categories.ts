export type PreferenceCategoryId = string

export type PreferenceCategory = {
  id: PreferenceCategoryId
  name: string
}

export type GetPreferenceCategoriesRequestParams = void

export type GetPreferenceCategoriesResponse = {
  categories: PreferenceCategory[]
}
