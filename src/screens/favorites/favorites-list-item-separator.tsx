import * as React from 'react'
import { StyleSheet } from 'react-native'
import { Divider } from '../../components/divider/divider'
import { spacing } from '../../theme/spacing'

export const FavoritesListItemSeparator = () => <Divider style={styles.container} marginTop={0} marginBottom={0} />

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing[5],
  },
})
