import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from '../../theme/hooks/use-theme'

export type UserBudgetBarProps = {
  max: number
  available: number
  spent: number
}

export const UserBudgetBar = ({ max, available, spent }: UserBudgetBarProps) => {
  const { colors } = useTheme()

  const availableWidth = Math.round((available / max) * 100)
  const spentWidth = Math.round((spent / max) * 100)
  return (
    <View style={[styles.container, { borderColor: colors.budgetBarBorder }]}>
      <View
        style={[styles.availableBar, { backgroundColor: colors.budgetBarAvailable }, { width: `${availableWidth}%` }]}
      />
      <View style={[styles.reservedBar, { backgroundColor: colors.budgetBarReserved }, { width: `${spentWidth}%` }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 13,
    borderRadius: 100,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    overflow: 'hidden',
  },
  availableBar: {
    height: '100%',
  },
  reservedBar: {
    height: '100%',
  },
})
