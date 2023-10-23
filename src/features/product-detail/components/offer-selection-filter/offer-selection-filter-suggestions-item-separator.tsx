import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from '../../../../theme/hooks/use-theme'

export const OfferSelectionFilterSuggestionsItemSeparator = () => {
  const { colors } = useTheme()

  return <View style={[styles.container, { backgroundColor: colors.itemSeparator }]} />
}

const styles = StyleSheet.create({ container: { width: '100%', height: 1 } })
