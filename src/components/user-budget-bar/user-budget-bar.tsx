import React from 'react'
import { StyleSheet, View } from 'react-native'
import { colors } from '../../theme/colors'

export type UserBudgetBarProps = {
  max: number
  available: number
  spent: number
}

export const UserBudgetBar = ({ max, available, spent }: UserBudgetBarProps) => {
  const availableWidth = Math.round((available / max) * 100)
  const spentWidth = Math.round((spent / max) * 100)
  return (
    <View style={styles.container}>
      <View style={[styles.availableBar, { width: `${availableWidth}%` }]} />
      <View style={[styles.reservedBar, { width: `${spentWidth}%` }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 13,
    borderRadius: 100,
    borderColor: colors.basicBlack,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },
  availableBar: {
    backgroundColor: colors.basicBlack,
    height: '100%',
  },
  reservedBar: {
    backgroundColor: colors.secondaryBase,
    height: '100%',
  },
})
