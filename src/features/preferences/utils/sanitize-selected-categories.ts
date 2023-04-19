import { PreferenceCategory } from '../../../services/api/types'

export const sanitizeSelectedCategories = (params: {
  selectedCategoryIds?: (string | undefined)[]
  availableCategories?: PreferenceCategory[]
}) => {
  const selectedCategoryIds = params.selectedCategoryIds || []
  const availableCategoryIds = (params.availableCategories || []).map(availableCategory => availableCategory.id)

  return selectedCategoryIds
    .filter((selectedCategoryId): selectedCategoryId is string => !!selectedCategoryId)
    .filter(selectedCategoryId => availableCategoryIds.includes(selectedCategoryId))
    .filter((selectedCategoryId, index, array) => array.indexOf(selectedCategoryId) === index)
}
