import React, { PropsWithChildren } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'

type InfoBoxProps = PropsWithChildren<{
  containerStyle?: StyleProp<ViewStyle>
}>

export const InfoBox: React.FC<InfoBoxProps> = ({ children, containerStyle }) => {
  const { colors } = useTheme()
  return (
    <View style={styles.button}>
      <View
        style={[
          styles.shadow,
          {
            backgroundColor: colors.boxShadow,
          },
        ]}
      />
      <View style={[styles.container, { backgroundColor: colors.infoBox }, containerStyle]}>{children}</View>
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
    borderRadius: 16,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  container: {
    flexDirection: 'column',
    padding: spacing[5],
    borderRadius: 16,
    overflow: 'hidden',
  },
})
