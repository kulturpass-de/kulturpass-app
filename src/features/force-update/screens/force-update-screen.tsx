import React from 'react'

import { Platform, ScrollView, StyleSheet, View } from 'react-native'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { LinkText } from '../../../components/link-text/link-text'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'

export const ForceUpdateScreen: React.FC = () => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()

  const screenTestId = buildTestId('force_update')
  const forceUpdateLinkI18nKey = Platform.OS === 'ios' ? 'force_update_link_ios' : 'force_update_link_android'

  return (
    <ModalScreen testID={screenTestId}>
      <ModalScreenHeader testID={addTestIdModifier(screenTestId, 'title')} titleI18nKey="force_update_title" />
      <ScrollView contentContainerStyle={styles.container}>
        <SvgImage
          testID={addTestIdModifier(screenTestId, 'image_alt')}
          i18nKey="force_update_image_alt"
          type="information-circle"
          width={80}
          height={80}
        />
        <TranslatedText
          textStyleOverrides={styles.title}
          textStyle="HeadlineH3Extrabold"
          i18nKey="force_update_content_title"
        />
        <TranslatedText
          textStyleOverrides={styles.text}
          textStyle="BodyRegular"
          i18nKey={Platform.OS === 'ios' ? 'force_update_content_text_ios' : 'force_update_content_text_android'}
        />
        <View style={styles.link}>
          <LinkText
            i18nKey={forceUpdateLinkI18nKey}
            testID={buildTestId(forceUpdateLinkI18nKey)}
            // TODO: Add missing app store and google play store links
            link={Platform.OS === 'ios' ? 'https://www.sap.de' : 'https://www.sap.de'}
          />
        </View>
      </ScrollView>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing[6],
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    color: colors.basicBlack,
    paddingTop: spacing[9],
    paddingHorizontal: spacing[8],
    textAlign: 'center',
  },
  text: {
    color: colors.moonDarkest,
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[5],
    textAlign: 'center',
  },
  link: {
    paddingHorizontal: spacing[5],
    width: '100%',
    justifyContent: 'flex-start',
  },
})
