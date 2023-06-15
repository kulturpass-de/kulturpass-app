import React, { PropsWithChildren } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { spacing } from '../../theme/spacing'
import { colors } from '../../theme/colors'

type InfoBoxProps = PropsWithChildren<{
  containerStyle?: StyleProp<ViewStyle>
  focusable?: boolean
}>

export const InfoBox: React.FC<InfoBoxProps> = ({ children, containerStyle, focusable }) => {
  return (
    <View style={styles.button} focusable={focusable}>
      <View style={styles.shadow} />
      <View style={[styles.container, containerStyle]}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    marginBottom: spacing[1],
  },
  shadow: {
    position: 'absolute',
    top: 3,
    left: 3,
    backgroundColor: colors.basicBlack,
    borderRadius: 16,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  container: {
    backgroundColor: colors.secondaryLighter,
    flexDirection: 'column',
    padding: spacing[5],
    borderRadius: 16,
    overflow: 'hidden',
  },
})
