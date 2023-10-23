import React, { ReactNode, useMemo } from 'react'
import { AccessibilityState, Pressable, StyleSheet, Text } from 'react-native'
import { TestId, useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import { textStyles } from '../../theme/typography'
import { SvgImage } from '../svg-image/svg-image'

export type ListItemProps = {
  title: string
  testID: TestId
  icon?: React.ReactElement
  type?: 'navigation' | 'link'
  onPress?: () => void
  noBorderBottom?: boolean
  accessibilityState?: AccessibilityState
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  testID,
  icon,
  onPress,
  type,
  noBorderBottom,
  accessibilityState,
}) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { addTestIdModifier } = useTestIdBuilder()
  const borderBottomStyle = noBorderBottom ? {} : { borderBottomWidth: 2, borderBottomColor: colors.listItemBorder }

  const iconElement: ReactNode = useMemo(() => {
    if (type === 'navigation') {
      return <SvgImage testID={addTestIdModifier(testID, 'icon')} type="chevron" height={24} width={24} />
    } else if (type === 'link' || type === 'navigation') {
      return <SvgImage testID={addTestIdModifier(testID, 'icon')} type="list-link" height={24} width={24} />
    } else {
      return null
    }
  }, [addTestIdModifier, testID, type])

  const accessibilityHint = type === 'link' ? t('external_link_accessibility_announcement') : undefined

  return (
    <Pressable
      style={[styles.container, { backgroundColor: colors.secondaryBackground }, borderBottomStyle]}
      onPress={onPress}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={accessibilityState}
      accessibilityHint={accessibilityHint}
      accessible>
      {icon ? icon : null}
      <Text style={[textStyles.BodyRegular, styles.text, { color: colors.labelColor }]}>{title}</Text>
      {iconElement}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: spacing[6],
    paddingRight: spacing[4],
    minHeight: spacing[10],
    gap: spacing[6],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    flex: 1,
  },
})
