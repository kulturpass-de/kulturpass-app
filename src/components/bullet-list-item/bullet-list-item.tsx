import React, { useMemo } from 'react'
import { PixelRatio, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useTextStyles } from '../../theme/hooks/use-text-styles'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import { AvailableTextStyles } from '../translated-text/types'

type BulletListItemProps = React.PropsWithChildren<{
  textStyle?: AvailableTextStyles
  style?: StyleProp<ViewStyle>
  bulletSize?: number
  hideBullet?: boolean
  testID?: string
}>

export const BulletListItem: React.FC<React.PropsWithChildren<BulletListItemProps>> = ({
  children,
  style,
  bulletSize = 4,
  textStyle = 'BodyRegular',
  hideBullet = false,
  testID,
}) => {
  const { colors } = useTheme()
  const textStyles = useTextStyles()

  const adjustedBulletSize = useMemo(() => {
    return bulletSize * PixelRatio.getFontScale()
  }, [bulletSize])

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View
        style={[
          styles.bulletContainer,
          {
            opacity: Number(!hideBullet),
            height: textStyles[textStyle].lineHeight * PixelRatio.getFontScale(),
          },
        ]}>
        <View
          style={[
            styles.bulletPoint,
            {
              backgroundColor: colors.labelColor,
              width: adjustedBulletSize,
              borderRadius: Math.ceil(adjustedBulletSize / 2),
            },
          ]}
        />
      </View>
      <View style={styles.bulletItems}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    minHeight: 24,
  },
  bulletItems: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flex: 1,
  },
  bulletPoint: {
    aspectRatio: 1,
  },
  bulletContainer: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacing[4],
  },
})
