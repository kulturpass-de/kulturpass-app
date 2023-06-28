import React, { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'
import { ModalScreenFooterPadding } from './modal-screen-footer-padding'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

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
  return (
    <View
      style={[
        styles.buttonFooter,
        { paddingTop: verticalPadding, paddingHorizontal: horizontalPadding },
        !ignorePaddingWithSafeArea ? { paddingBottom: verticalPadding } : undefined,
      ]}>
      <View style={[styles.buttonWrapper]}>{children}</View>
      {ignorePaddingWithSafeArea ? <ModalScreenFooterPadding fallbackPadding={verticalPadding} /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  buttonFooter: {
    backgroundColor: colors.basicWhite,
    borderTopWidth: 2,
    borderTopColor: colors.basicBlack,
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  buttonWrapper: {
    rowGap: spacing[5],
  },
})
