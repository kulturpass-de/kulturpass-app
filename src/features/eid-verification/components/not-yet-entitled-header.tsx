import React from 'react'
import { StyleSheet, View } from 'react-native'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { buildTestId } from '../../../services/test-id/test-id'
import { useUserInfo } from '../../../services/user/use-user-info'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'

export const NotYetEntitledHeader: React.FC = () => {
  const { colors } = useTheme()
  const { name } = useUserInfo()

  return (
    <View style={styles.container}>
      <View style={[styles.shadow, { backgroundColor: colors.boxShadow }]} />
      <View style={[styles.innerContainer, { backgroundColor: colors.infoBox }]}>
        <View style={styles.shrink}>
          <TranslatedText
            testID={buildTestId('not_yet_entitled_title')}
            i18nKey="not_yet_entitled_title"
            i18nParams={{ name }}
            textStyle="HeadlineH4Extrabold"
            textStyleOverrides={{ color: colors.labelColor }}
          />
          <View style={styles.content}>
            <SvgImage type="age-eighteen" width={36} height={36} />
            <TranslatedText
              textStyleOverrides={[styles.text, { color: colors.labelColor }]}
              testID={buildTestId('not_yet_entitled_button_text')}
              i18nKey="not_yet_entitled_button_text"
              textStyle="BodySmallMedium"
            />
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
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
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    marginTop: spacing[5],
    flexShrink: 1,
  },
  text: {
    marginLeft: spacing[4],
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  shrink: {
    flexShrink: 1,
  },
})
