import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { TestId } from '../../services/test-id/test-id'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { textStyles } from '../../theme/typography'
import { Icon } from '../icon/icon'

const styles = StyleSheet.create({
  container: {
    paddingLeft: spacing[6],
    paddingRight: spacing[2],
    height: spacing[10],
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

export type ListItemProps = {
  title: string
  testID: TestId
  icon?: JSX.Element
  chevron?: boolean
  onPress?: () => void
  noBorderBottom?: boolean
}

export const ListItem: React.FC<ListItemProps> = ({ title, testID, icon, onPress, chevron, noBorderBottom }) => {
  const borderBottomStyle = noBorderBottom ? {} : { borderBottomWidth: 2, borderBottomColor: colors.basicBlack }

  return (
    <Pressable
      style={[styles.container, borderBottomStyle]}
      onPress={onPress}
      testID={testID}
      accessibilityLabel={title}
      accessible>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[textStyles.BodyRegular, styles.text]}>{title}</Text>
      {chevron && <Icon source="Chevron" height={24} />}
    </Pressable>
  )
}
