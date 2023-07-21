import React, { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import { ModalScreenFooterPadding } from './modal-screen-footer-padding'

export type ModalScreenFooterProps = PropsWithChildren<{
  verticalPadding?: number
  horizontalPadding?: number
  ignorePaddingWithSafeArea?: boolean
}>

export const ModalScreenFooter: React.FC<ModalScreenFooterProps> = ({
  children,
  horizontalPadding = spacing[5],
  verticalPadding = spacing[5],
  ignorePaddingWithSafeArea = true,
}) => {
  const { colors } = useTheme()
  return (
    <View
      style={[
        styles.buttonFooter,
        {
          paddingTop: verticalPadding,
          paddingHorizontal: horizontalPadding,
          backgroundColor: colors.secondaryBackground,
          borderTopColor: colors.footerBorder,
        },
        !ignorePaddingWithSafeArea ? { paddingBottom: verticalPadding } : undefined,
      ]}>
      <View style={[styles.buttonWrapper]}>{children}</View>
      {ignorePaddingWithSafeArea ? <ModalScreenFooterPadding fallbackPadding={verticalPadding} /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  buttonFooter: {
    borderTopWidth: 2,
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  buttonWrapper: {
    rowGap: spacing[5],
  },
})
