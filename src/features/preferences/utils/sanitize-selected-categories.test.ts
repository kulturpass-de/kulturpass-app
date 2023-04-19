import { sanitizeSelectedCategories } from './sanitize-selected-categories'

describe('sanitize-selected-categories', () => {
  const availableCategories = [
    { id: 'category 1', name: '1' },
    { id: 'category 2', name: '2' },
    { id: 'category 3', name: '3' },
  ]

  it('should return only from availableCategories', async () => {
    let selectedCategoryIds = ['category 4', 'category 5']
    let result = sanitizeSelectedCategories({ availableCategories, selectedCategoryIds })
    expect(result).toEqual([])

    selectedCategoryIds = ['category 1', 'category 6', 'category 3']
    result = sanitizeSelectedCategories({ availableCategories, selectedCategoryIds })
    expect(result).toEqual(['category 1', 'category 3'])

    selectedCategoryIds = ['category 2']
    result = sanitizeSelectedCategories({ availableCategories, selectedCategoryIds })
    expect(result).toEqual(['category 2'])
  })

  it('should not include undefined values', async () => {
    let selectedCategoryIds = ['category 4', 'category 2', undefined]
    let result = sanitizeSelectedCategories({ availableCategories, selectedCategoryIds })
    expect(result).toEqual(['category 2'])
  })

  it('should always return an array', async () => {
    let result = sanitizeSelectedCategories({ availableCategories })
    expect(result).toEqual([])

    result = sanitizeSelectedCategories({})
    expect(result).toEqual([])

    result = sanitizeSelectedCategories({ selectedCategoryIds: ['category 1'] })
    expect(result).toEqual([])
  })

  it('should return unique value', async () => {
    let selectedCategoryIds = ['category 1', 'category 5', 'category 1', 'category 5', 'category 3']
    let result = sanitizeSelectedCategories({ availableCategories, selectedCategoryIds })
    expect(result).toEqual(['category 1', 'category 3'])
  })
})
