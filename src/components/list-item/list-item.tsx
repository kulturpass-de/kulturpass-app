import React, { ReactNode, useMemo } from 'react'
import { AccessibilityState, Pressable, StyleSheet, Text, View } from 'react-native'
import { TestId, useTestIdBuilder } from '../../services/test-id/test-id'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { textStyles } from '../../theme/typography'
import { SvgImage } from '../svg-image/svg-image'
import { Icon } from '../icon/icon'
import { useTranslation } from '../../services/translation/translation'

export type ListItemProps = {
  title: string
  testID: TestId
  icon?: JSX.Element
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
  const { addTestIdModifier } = useTestIdBuilder()
  const borderBottomStyle = noBorderBottom ? {} : { borderBottomWidth: 2, borderBottomColor: colors.basicBlack }

  const iconElement: ReactNode = useMemo(() => {
    if (type === 'navigation') {
      return <Icon source="Chevron" height={24} width={24} />
    } else if (type === 'link') {
      return <SvgImage testID={addTestIdModifier(testID, 'icon')} type="list-link" height={24} width={24} />
    } else {
      return null
    }
  }, [addTestIdModifier, testID, type])

  const accessibilityHint = type === 'link' ? t('external_link_accessibility_announcement') : undefined

  return (
    <Pressable
      style={[styles.container, borderBottomStyle]}
      onPress={onPress}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={accessibilityState}
      accessibilityHint={accessibilityHint}
      accessible>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[textStyles.BodyRegular, styles.text]}>{title}</Text>
      {iconElement}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: spacing[6],
    paddingRight: spacing[4],
    minHeight: spacing[10],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.basicWhite,
  },
  icon: {
    marginRight: spacing[6],
  },
  text: {
    flex: 1,
    color: colors.moonDarkest,
  },
})
