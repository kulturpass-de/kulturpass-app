import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from '../../services/translation/translation'
import { useTheme } from '../../theme/hooks/use-theme'
import { applyAccessibilityReplacements } from '../translated-text/accessibility-replacements'
import { AvailableTranslations } from '../translated-text/types'

export type UserBudgetBarProps = {
  max: number
  available: number
  spent: number
  i18nKey: AvailableTranslations
  i18nParams?: {}
  spentPercentage: number
}

export const UserBudgetBar = ({ max, available, spent, i18nKey, i18nParams }: UserBudgetBarProps) => {
  const { colors } = useTheme()
  const availableWidth = Math.round((available / max) * 100)
  const spentWidth = Math.round((spent / max) * 100)
  const { t } = useTranslation()
  let accessibilityLabel = i18nParams ? t(i18nKey, i18nParams) : t(i18nKey)
  accessibilityLabel = applyAccessibilityReplacements(accessibilityLabel)

  return (
    <View
      style={[styles.container, { borderColor: colors.budgetBarBorder }]}
      accessible
      accessibilityLabel={accessibilityLabel}>
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
