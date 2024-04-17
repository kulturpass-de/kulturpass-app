import { PreferencesFormData } from '../components/preferences'

export const isPreferencesFormDirty = (
  oldData: Partial<PreferencesFormData>,
  newData: Partial<PreferencesFormData>,
) => {
  return (
    (oldData.postalCode !== undefined &&
      newData.postalCode !== undefined &&
      oldData.postalCode !== newData.postalCode) ||
    newData.categories?.length !== oldData.categories?.length ||
    !oldData.categories?.every(category => newData.categories?.includes(category))
  )
}
