import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

export const FavoritesListItemSeparator = () => (
  <View style={styles.container}>
    <View style={styles.line} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing[5],
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: colors.sunLight,
  },
})
