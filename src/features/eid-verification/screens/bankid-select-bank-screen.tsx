import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { StyleSheet, TextInputProps, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import { z } from 'zod'
import { Button } from '../../../components/button/button'
import { FormFieldWithControl } from '../../../components/form-fields/form-field-with-control'
import { SearchFormField } from '../../../components/form-fields/search-form-field'
import { Illustration } from '../../../components/illustration/illustration'
import { LinkText } from '../../../components/link-text/link-text'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { SuggestionList } from '../../../components/suggestion-list/suggestion-list'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { BankIdSuggestion } from '../../../services/api/types/commerce/commerce-get-bank-id-suggestions'
import { useFaqLink } from '../../../services/faq-configuration/hooks/use-faq-link'
import { selectBankIdBetaEnabled } from '../../../services/redux/slices/persisted-app-core'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import {
  getCdcDpsDocumentUrl,
  useLocalizedEnvironmentUrl,
} from '../../../utils/links/hooks/use-localized-environment-url'
import { sendMail } from '../../../utils/links/utils'
import { BetaBadge } from '../components/beta-badge'
import { BANK_ID_SCHEMA } from '../form/form-validation'
import { useGetBankSuggestionsLazyQuery } from '../hooks/use-fetch-bank-suggestions-lazy-query'

export type BankIdSelectBankScreenProps = {
  onNext: (selectedSuggestion: BankIdSuggestion) => void
  onClose: () => void
}

const MAIL_RECIPIENT = 'support@kulturpass.de'

export const BankIdSelectBankScreen: React.FC<BankIdSelectBankScreenProps> = ({ onNext, onClose }) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()
  const { t } = useTranslation()

  const eidGeneralFaqLink = useFaqLink('EID_IDENTIFICATION_GENERAL')
  const eidIdentificationVideo = useFaqLink('IDENTIFICATION_VIDEO_SPK')
  const bankIdBetaEnabled = useSelector(selectBankIdBetaEnabled)
  const dpsDocumentUrl = useLocalizedEnvironmentUrl(getCdcDpsDocumentUrl)

  const screenTestId = buildTestId('bankid_select_bank')

  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<BankIdSuggestion | undefined>()

  const { fetchBankSuggestions, bankSuggestions } = useGetBankSuggestionsLazyQuery()

  const handleNext = useCallback(async () => {
    if (selectedSuggestion === undefined) {
      return
    }
    onNext(selectedSuggestion)
  }, [onNext, selectedSuggestion])

  const onSendEmail = useCallback(
    async () => sendMail(MAIL_RECIPIENT, t('bankid_select_bank_mail_subject'), t('bankid_select_bank_mail_body')),
    [t],
  )

  const form = useForm<{ bankId: string }>({
    shouldFocusError: false,
    mode: 'onChange',
    resolver: zodResolver(
      z.object({
        bankId: z.literal('').or(BANK_ID_SCHEMA(t, fetchBankSuggestions)),
      }),
    ),
  })

  const onFocus = useCallback<NonNullable<TextInputProps['onBlur']>>(() => {
    setShowSuggestions(true)
  }, [])

  const onClearSearchField = useCallback(() => {
    form.resetField('bankId', { defaultValue: '' })
    setSelectedSuggestion(undefined)
  }, [form])

  const keyExtractor = useCallback((item: BankIdSuggestion) => `${item.name}-${item.code}`, [])

  useEffect(() => {
    return onClearSearchField
  }, [onClearSearchField])

  const onSetSelectedSuggestion = useCallback(
    (suggestion: BankIdSuggestion) => {
      setSelectedSuggestion(suggestion)
      form.setValue('bankId', suggestion.name, { shouldValidate: true })
      setShowSuggestions(false)
    },
    [form],
  )

  const bankId: string | undefined = useWatch({
    control: form.control,
    name: 'bankId',
    defaultValue: '',
  })

  useEffect(() => {
    if (bankId !== selectedSuggestion?.name) {
      setSelectedSuggestion(undefined)
    }
  }, [bankId, selectedSuggestion?.name])

  return (
    <ModalScreen whiteBottom testID={screenTestId}>
      <ModalScreenHeader
        testID={addTestIdModifier(screenTestId, 'title')}
        titleI18nKey="bankid_select_bank_title"
        onPressClose={onClose}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <Illustration
          testID={addTestIdModifier(screenTestId, 'image_alt')}
          i18nKey="bankid_select_bank_image_alt"
          type="bank-id"
          style={styles.illustration}
        />
        <View style={styles.contentContainer}>
          <TranslatedText
            textStyleOverrides={[styles.contentTitle, { color: colors.labelColor }]}
            testID={addTestIdModifier(screenTestId, 'content_title')}
            i18nKey="bankid_select_bank_content_title"
            textStyle="HeadlineH3Extrabold"
          />
          {bankIdBetaEnabled ? (
            <View
              style={[styles.betaPhaseBox, { backgroundColor: colors.chipBackground, borderColor: colors.chipBorder }]}>
              <BetaBadge />
              <TranslatedText
                i18nKey="bankid_select_beta_phase_text"
                textStyleOverrides={{ color: colors.labelColor }}
                textStyle="CaptionSemibold"
              />
            </View>
          ) : null}
          <TranslatedText
            textStyleOverrides={[styles.textPadding, { color: colors.labelColor }]}
            testID={addTestIdModifier(screenTestId, 'content_text')}
            i18nKey="bankid_select_bank_content_text"
            textStyle="BodyRegular"
          />
          <TranslatedText
            textStyleOverrides={[styles.textPadding, { color: colors.labelColor }]}
            testID={addTestIdModifier(screenTestId, 'action_text')}
            i18nKey="bankid_select_bank_action_text"
            textStyle="BodyBold"
          />

          <View style={styles.formField}>
            <FormFieldWithControl
              name="bankId"
              component={SearchFormField}
              onClear={onClearSearchField}
              testID={addTestIdModifier(screenTestId, 'bankId')}
              control={form.control}
              ignoredErrorTypes={['too_small']}
              onFocus={onFocus}
              containerStyle={styles.formFieldContainer}
              accessibilityLabelI18nKey="bankid_select_bank_input_text_label"
              labelI18nKey="bankid_select_bank_input_text_label"
              labelTextStyle="BodySmallMedium"
              isRequired
              disableAccessibilityForLabel
            />

            {showSuggestions && bankId.length > 2 ? (
              <View style={styles.suggestionList} pointerEvents="box-none">
                <SuggestionList
                  testID={screenTestId}
                  suggestions={showSuggestions ? bankSuggestions : []}
                  onSelectSuggestion={onSetSelectedSuggestion}
                  titleKey="name"
                  subtitleKey="code"
                  suggestionItemAccessibilityHintKey="offerSelectionFilter_suggestions_item_accessibility_hint"
                  keyExtractor={keyExtractor}
                />
              </View>
            ) : null}
          </View>
          {selectedSuggestion !== undefined ? (
            <TranslatedText
              textStyleOverrides={[styles.textPadding, { color: colors.labelColor }]}
              testID={addTestIdModifier(screenTestId, 'bank_available_text')}
              i18nKey="bankid_select_bank_bank_available_text"
              textStyle="BodyRegular"
            />
          ) : null}
          <View style={styles.textPadding}>
            <LinkText
              testID={addTestIdModifier(screenTestId, 'dataprivacy_link')}
              i18nKey="bankid_select_bank_dataprivacy_link"
              link={dpsDocumentUrl}
            />
          </View>
          <View style={styles.textPadding}>
            <LinkText
              testID={addTestIdModifier(screenTestId, 'bank_not_found_link')}
              i18nKey="bankid_select_bank_bank_not_found_link"
              onPress={onSendEmail}
            />
          </View>
          <View style={styles.textPadding}>
            <LinkText
              testID={addTestIdModifier(screenTestId, 'faq_link')}
              i18nKey="bankid_select_bank_faq_link"
              link={eidGeneralFaqLink}
            />
          </View>
          <View style={styles.textPadding}>
            <LinkText
              testID={addTestIdModifier(screenTestId, 'video_link')}
              i18nKey="bankid_select_bank_video_link"
              link={eidIdentificationVideo}
            />
          </View>
        </View>
      </ScrollView>
      <ModalScreenFooter>
        <Button
          onPress={handleNext}
          variant="primary"
          disabled={selectedSuggestion === undefined}
          testID={addTestIdModifier(screenTestId, 'next_button')}
          i18nKey="bankid_select_bank_next_button"
        />
        <Button
          onPress={onClose}
          variant="primary"
          testID={addTestIdModifier(screenTestId, 'cancel_button')}
          i18nKey="bankid_select_bank_cancel_button"
        />
      </ModalScreenFooter>
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
  betaPhaseBox: {
    flexDirection: 'column',
    marginTop: spacing[6],
    padding: spacing[5],
    borderRadius: 16,
    borderWidth: 2,
    gap: spacing[2],
  },
  textPadding: {
    paddingTop: spacing[6],
  },
  formField: {
    paddingTop: spacing[3],
    zIndex: 1,
  },
  formFieldContainer: { marginBottom: 0, marginTop: spacing[5] },
  suggestionList: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
})
