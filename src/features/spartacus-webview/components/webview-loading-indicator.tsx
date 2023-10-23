import React from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'

export type WebviewLoadingIndicatorProps = {
  contentOffset?: number
}

export const WebviewLoadingIndicator: React.FC<WebviewLoadingIndicatorProps> = ({ contentOffset }) => {
  const { colors } = useTheme()
  const { width, height } = useWindowDimensions()

  return (
    <View
      testID="webview_loading_skeleton"
      style={[styles.skeleton, { backgroundColor: colors.primaryBackground, marginTop: contentOffset }]}>
      <SvgImage type="webview-skeleton" width={width - spacing[5] * 2} height={height} />
    </View>
  )
}

const styles = StyleSheet.create({
  skeleton: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6],
  },
})
