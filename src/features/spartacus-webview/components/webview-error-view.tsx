import React from 'react'
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Button } from '../../../components/button/button'
import { Illustration } from '../../../components/illustration/illustration'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'

export const ERR_NO_INTERNET = 'ERR_NO_INTERNET'
export const ERR_UNKNOWN = 'ERR_UNKNOWN'

export type WebviewErrorViewProps = {
  onRefresh?: () => void
  errorCode: number | typeof ERR_NO_INTERNET | typeof ERR_UNKNOWN
  style?: StyleProp<ViewStyle>
}

export const WebviewErrorView: React.FC<WebviewErrorViewProps> = ({ onRefresh, errorCode, style }) => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.primaryBackground }]}
      contentContainerStyle={[styles.content, style]}>
      <Illustration i18nKey="noNetwork_image_alt" testID={buildTestId('webView_noNetwork_image')} type="no-network" />
      <View style={styles.contentContainer}>
        <TranslatedText
          i18nKey={errorCode === ERR_NO_INTERNET ? 'webview_error_noInternet_title' : 'webview_error_generic_title'}
          textStyleOverrides={[styles.title, { color: colors.labelColor }]}
          textStyle="HeadlineH4Extrabold"
        />
        <TranslatedText
          i18nKey={
            errorCode === ERR_NO_INTERNET ? 'webview_error_noInternet_subtitle' : 'webview_error_generic_subtitle'
          }
          i18nParams={{ errorCode }}
          textStyleOverrides={[styles.subtitle, { color: colors.labelColor }]}
          textStyle="BodyRegular"
        />
        <View style={styles.spacer} />
        {onRefresh ? (
          <View style={styles.button}>
            <Button i18nKey="webview_error_refresh_button" variant="tertiary" onPress={onRefresh} />
          </View>
        ) : null}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flexDirection: 'column',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    paddingHorizontal: spacing[7],
  },
  title: {
    paddingBottom: spacing[2],
  },
  subtitle: {
    textAlign: 'center',
  },
  spacer: {
    flexGrow: 1,
    minHeight: spacing[2],
  },
  button: {
    paddingBottom: spacing[6],
  },
})
