import React, { useCallback, useMemo, useState } from 'react'
import { Keyboard, LayoutChangeEvent, ScrollView, StyleSheet, View } from 'react-native'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { AvailableTranslations } from '../translated-text/types'
import { SUGGESTION_LIST_ITEM_BORDER_RADIUS, SuggestionListItem } from './suggestion-list-item'
import { SuggestionListItemEmpty } from './suggestion-list-item-empty'
import { SuggestionListItemSeparator } from './suggestion-list-item-separator'

export type SuggestionListProps<
  T extends Record<Title, string> & Partial<Record<Subtitle, string>>,
  Title extends keyof T,
  Subtitle extends keyof T,
> = {
  testID: string
  onSelectSuggestion: (suggestion: T) => void
  suggestions: T[] | null
  suggestionItemAccessibilityHintKey: AvailableTranslations
  titleKey: Title
  subtitleKey: Subtitle
  keyExtractor?: ((item: T, index: number) => string) | undefined
}

const MAX_ITEMS = 4

export const SuggestionList = <
  T extends Record<Title, string> & Partial<Record<Subtitle, string>>,
  Title extends keyof T,
  Subtitle extends keyof T,
>({
  testID,
  suggestions,
  onSelectSuggestion,
  suggestionItemAccessibilityHintKey,
  titleKey,
  subtitleKey,
  keyExtractor,
}: SuggestionListProps<T, Title, Subtitle>) => {
  const { t } = useTranslation()
  const { addTestIdModifier } = useTestIdBuilder()
  const [itemHeight, setItemHeight] = useState<number>(52)

  const suggestionsLength = suggestions?.length ?? null

  const onLayout = useCallback((evt: LayoutChangeEvent) => {
    setItemHeight(Math.round(evt.nativeEvent.layout.height))
  }, [])

  const suggestionsItems = useMemo(() => {
    if (!suggestions?.length) {
      return null
    }

    return suggestions.map((item, index, arr) => (
      <View key={keyExtractor ? keyExtractor(item, index) : index}>
        <View onLayout={onLayout}>
          <SuggestionListItem
            testID={addTestIdModifier(testID, 'suggestions_item')}
            topRadius={index === 0}
            bottomRadius={index >= (suggestionsLength ?? 0) - 1}
            title={item[titleKey]}
            subtitle={item[subtitleKey]}
            accessibilityHint={t(suggestionItemAccessibilityHintKey, {
              position: index + 1,
              total: suggestionsLength ?? index + 1,
            })}
            // eslint-disable-next-line react/jsx-no-bind
            onPress={() => {
              Keyboard.dismiss()
              onSelectSuggestion(item)
            }}
          />
        </View>
        {index === arr.length - 1 ? null : <SuggestionListItemSeparator />}
      </View>
    ))
  }, [
    addTestIdModifier,
    testID,
    titleKey,
    subtitleKey,
    t,
    suggestionItemAccessibilityHintKey,
    onSelectSuggestion,
    onLayout,
    keyExtractor,
    suggestions,
    suggestionsLength,
  ])

  if (suggestionsLength === 0) {
    return (
      <SuggestionListItemEmpty
        style={{ transform: [{ translateY: 64 }] }}
        height={64}
        testID={addTestIdModifier(testID, 'suggestions_item_empty')}
      />
    )
  }

  if (suggestionsLength === null || !suggestions) {
    return null
  }

  return (
    <ScrollView
      testID={addTestIdModifier(testID, 'suggestions_list')}
      showsVerticalScrollIndicator={false}
      bounces={false}
      keyboardShouldPersistTaps="handled"
      style={[
        styles.flatListContainer,
        {
          maxHeight: itemHeight * MAX_ITEMS,
          transform: [{ translateY: itemHeight * (suggestionsLength > MAX_ITEMS ? MAX_ITEMS : suggestionsLength) }],
          borderBottomRightRadius: SUGGESTION_LIST_ITEM_BORDER_RADIUS,
          borderBottomLeftRadius: SUGGESTION_LIST_ITEM_BORDER_RADIUS,
        },
      ]}>
      {suggestionsItems}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  flatListContainer: {
    width: '100%',
  },
})
