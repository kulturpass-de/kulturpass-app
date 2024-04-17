import { isPreferencesFormDirty } from './is-preferences-form-dirty'

describe('isPreferencesFormDirty', () => {
  it('should validate not to be dirty, since nothing has changed', () => {
    expect(isPreferencesFormDirty({ categories: [], postalCode: '' }, { categories: [], postalCode: '' })).toBe(false)
    expect(isPreferencesFormDirty({ categories: [], postalCode: '' }, { categories: [] })).toBe(false)
    expect(isPreferencesFormDirty({ categories: [] }, { categories: [], postalCode: '' })).toBe(false)
  })

  it('should validate to be dirty, since a category has been removed', () => {
    expect(isPreferencesFormDirty({ categories: ['test'], postalCode: '' }, { categories: [], postalCode: '' })).toBe(
      true,
    )
  })

  it('should validate to be dirty, since a postal code has been entered', () => {
    expect(isPreferencesFormDirty({ categories: [], postalCode: '' }, { categories: [], postalCode: '55555' })).toBe(
      true,
    )
  })

  it('should validate to be dirty, since a category has been added', () => {
    expect(isPreferencesFormDirty({ categories: [], postalCode: '' }, { categories: ['test'], postalCode: '' })).toBe(
      true,
    )
  })

  it('should validate to be dirty, since a category has changed', () => {
    expect(
      isPreferencesFormDirty(
        { categories: ['one', 'two'], postalCode: '' },
        { categories: ['one', 'four'], postalCode: '' },
      ),
    ).toBe(true)
  })
})
