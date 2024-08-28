import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import { Illustration } from '../../../components/illustration/illustration'
import { LinkText } from '../../../components/link-text/link-text'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useFaqLink } from '../../../services/faq-configuration/hooks/use-faq-link'
import { selectBankIdBetaEnabled } from '../../../services/redux/slices/persisted-app-core'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { HITSLOP } from '../../../theme/constants'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { BetaBadge } from '../components/beta-badge'

export type IdentificationSelectionScreenProps = {
  onEidStart: () => void
  onBankIDStart: () => void
  onClose: () => void
}

export const IdentificationSelectionScreen: React.FC<IdentificationSelectionScreenProps> = ({
  onEidStart,
  onBankIDStart,
  onClose,
}) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const { t } = useTranslation()
  const { colors } = useTheme()

  const eidGeneralFaqLink = useFaqLink('EID_IDENTIFICATION_GENERAL')
  const bankIdBetaEnabled = useSelector(selectBankIdBetaEnabled)

  const screenTestId = buildTestId('identification_selection')

  return (
    <ModalScreen withoutBottomSafeArea whiteBottom={false} testID={screenTestId}>
      <ModalScreenHeader
        testID={addTestIdModifier(screenTestId, 'title')}
        titleI18nKey="identification_selection_title"
        onPressClose={onClose}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <Illustration
          testID={addTestIdModifier(screenTestId, 'image_alt')}
          i18nKey="identification_selection_image_alt"
          type="select-identification"
          style={styles.illustration}
        />
        <View style={styles.contentContainer}>
          <TranslatedText
            textStyleOverrides={[styles.contentTitle, { color: colors.labelColor }]}
            testID={addTestIdModifier(screenTestId, 'content_title')}
            i18nKey="identification_selection_content_title"
            textStyle="HeadlineH3Extrabold"
          />
          <TranslatedText
            textStyleOverrides={[styles.textPadding, { color: colors.labelColor }]}
            testID={addTestIdModifier(screenTestId, 'content_text')}
            i18nKey="identification_selection_content_text"
            textStyle="BodyRegular"
          />
          <Pressable
            accessible
            accessibilityRole="button"
            hitSlop={HITSLOP}
            testID={addTestIdModifier(screenTestId, 'eid_button')}
            style={[styles.identificationButton, { backgroundColor: colors.secondaryBackground }]}
            onPress={onEidStart}>
            <SvgImage
              type="id-1"
              width={24}
              height={24}
              accessibilityLabel={t('identification_selection_eid_button_icon_alt')}
            />
            <View style={styles.identificationButtonContent}>
              <TranslatedText
                textStyleOverrides={{ color: colors.labelColor }}
                testID={addTestIdModifier(screenTestId, 'eid_button_title')}
                i18nKey="identification_selection_eid_button_title"
                textStyle="BodyBold"
              />
              <Text
                accessible
                testID={addTestIdModifier(screenTestId, 'eid_button_subtitle')}
                style={[textStyles.BodySmallRegular, { color: colors.labelColor }]}>
                {t('identification_selection_eid_button_subtitle')}
              </Text>
            </View>
            <SvgImage type="chevron" width={24} height={24} />
          </Pressable>
          <Pressable
            accessible
            accessibilityRole="button"
            hitSlop={HITSLOP}
            testID={addTestIdModifier(screenTestId, 'bankid_button')}
            style={[styles.identificationButton, { backgroundColor: colors.secondaryBackground }]}
            onPress={onBankIDStart}>
            <SvgImage
              type="government"
              width={24}
              height={24}
              accessibilityLabel={t('identification_selection_bankid_button_icon_alt')}
            />
            <View style={styles.identificationButtonContent}>
              <TranslatedText
                textStyleOverrides={{ color: colors.labelColor }}
                testID={addTestIdModifier(screenTestId, 'bankid_button_title')}
                i18nKey="identification_selection_bankid_button_title"
                textStyle="BodyBold"
              />
              {bankIdBetaEnabled && <BetaBadge />}
              <Text
                accessible
                testID={addTestIdModifier(screenTestId, 'bankid_button_subtitle')}
                style={[textStyles.BodySmallRegular, { color: colors.labelColor }]}>
                {t('identification_selection_bankid_button_subtitle')}
              </Text>
            </View>
            <SvgImage type="chevron" width={24} height={24} />
          </Pressable>
          <View style={styles.textPadding}>
            <LinkText
              testID={addTestIdModifier(screenTestId, 'faq_link')}
              i18nKey="identification_selection_faq_link"
              link={eidGeneralFaqLink}
            />
          </View>
        </View>
      </ScrollView>
    </ModalScreen>
  )
}

export const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  illustration: {
    alignItems: 'center',
  },
  contentContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
  },
  contentTitle: {
    paddingTop: spacing[6],
    flexWrap: 'wrap',
  },
  textPadding: {
    paddingTop: spacing[6],
  },
  identificationButton: {
    borderRadius: 16,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    marginTop: spacing[6],
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  identificationButtonContent: {
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    flex: 1,
    flexGrow: 1,
    gap: spacing[3],
  },
})
