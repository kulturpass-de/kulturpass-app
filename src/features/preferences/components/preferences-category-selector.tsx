import React, { useCallback, useState } from 'react'
import { type LayoutChangeEvent, type LayoutRectangle, StyleSheet, View } from 'react-native'

import { PreferenceCategory } from '../../../services/api/types'
import { TestId, useTestIdBuilder } from '../../../services/test-id/test-id'

import { spacing } from '../../../theme/spacing'
import { PreferencesCategorySelectorItem } from './preferences-category-selector-item'
import { sanitizeSelectedCategories } from '../utils/sanitize-selected-categories'
import { isDeviceTextScaled } from '../../../theme/utils'

export type PreferencesCategorySelectorProps = {
  testID: TestId
  availableCategories?: PreferenceCategory[]
  onChange?: (newValue: string[]) => void
  value?: string[]
}

export const PreferencesCategorySelector = React.forwardRef<View, PreferencesCategorySelectorProps>(
  ({ availableCategories, testID, value, onChange }, ref) => {
    const [size, setSize] = useState<LayoutRectangle>()

    const { addTestIdModifier } = useTestIdBuilder()

    const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
      setSize(nativeEvent.layout)
    }, [])

    const onSelect = useCallback(
      (category: PreferenceCategory) => {
        if (!value) {
          onChange?.([category.id])
          return
        }

        if (value.includes(category.id)) {
          onChange?.(value.filter(v => v !== category.id))
          return
        }

        onChange?.([...value, category.id])
      },
      [value, onChange],
    )

    const canSelectMore = sanitizeSelectedCategories({ selectedCategoryIds: value, availableCategories }).length < 4

    const grid = isDeviceTextScaled() ? 'column' : 'rows'

    return (
      <View ref={ref} style={grid === 'column' ? styles.columns : styles.rows} onLayout={onLayout}>
        {size &&
          availableCategories?.map(category => {
            const isSelected = value?.includes(category.id)
            return (
              <PreferencesCategorySelectorItem
                testID={addTestIdModifier(testID, `category_${category.id}`)}
                key={category.id}
                style={grid === 'column' ? styles.columnItem : { width: size.width / 2 - spacing[5] }}
                isSelected={isSelected}
                isSelectable={isSelected || canSelectMore}
                category={category}
                onSelect={onSelect}
              />
            )
          })}
      </View>
    )
  },
)

const styles = StyleSheet.create({
  rows: {
    margin: -spacing[5] / 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  columns: {
    flexDirection: 'column',
  },
  columnItem: {
    width: '100%',
  },
})
