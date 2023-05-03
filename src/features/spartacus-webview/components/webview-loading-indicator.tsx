import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { WebviewSkeleton } from '../../../components/svg-image/svgs'
import { spacing } from '../../../theme/spacing'
import { colors } from '../../../theme/colors'

export const WebviewLoadingIndicator: React.FC = () => {
  const screenWidth = Dimensions.get('screen').width
  return (
    <View testID="webview_loading_skeleton" style={styles.skeleton}>
      <WebviewSkeleton width={screenWidth - spacing[5] * 2} />
    </View>
  )
}

const styles = StyleSheet.create({
  skeleton: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[6],
    backgroundColor: colors.basicBackground,
  },
})
