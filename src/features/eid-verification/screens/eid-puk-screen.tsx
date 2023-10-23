import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { z } from 'zod'
import { FormFieldWithControl } from '../../../components/form-fields/form-field-with-control'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { useFocusErrors } from '../../form-validation/hooks/use-focus-errors'
import { AboutPinLinkSection } from '../components/about-pin-link-section'
import { EidButtonFooter } from '../components/eid-button-footer'
import { PinInput } from '../components/pin-input'

export type EidPukScreenProps = {
  onNext: (puk: string) => void
  onClose: () => void
  retry: boolean
}

export const EidPukScreen: React.FC<EidPukScreenProps> = ({ onNext, onClose, retry }) => {
  const { buildTestId } = useTestIdBuilder()
  const { t } = useTranslation()

  const form = useForm<{ puk: string }>({
    shouldFocusError: false,
    resolver: zodResolver(
      z.object({
        puk: z.string().min(10).max(10),
      }),
    ),
  })

  useFocusErrors(form)

  useEffect(() => {
    if (retry) {
      form.setError('puk', {
        message: t('eid_pukView_invalid_puk'),
      })
    } else {
      form.clearErrors('puk')
    }
  }, [retry, form, t])

  const onPressSubmit = form.handleSubmit(async values => {
    onNext(values.puk)
  })

  return (
    <ModalScreen whiteBottom testID={buildTestId('eid_pukView')}>
      <ModalScreenHeader
        testID={buildTestId('eid_pukView_title')}
        titleI18nKey="eid_pukView_title"
        onPressClose={onClose}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.contentContainer}>
          <TranslatedText
            testID={buildTestId('eid_pukView_content_text')}
            i18nKey="eid_pukView_content_text"
            textStyle="BodyRegular"
            textStyleOverrides={styles.contentText}
          />
          <TranslatedText
            textStyleOverrides={{ color: colors.moonDarkest }}
            testID={buildTestId('eid_pukView_content_title')}
            i18nKey="eid_pukView_content_title"
            textStyle="HeadlineH4Extrabold"
          />
          <View style={styles.canView}>
            <FormFieldWithControl
              testID={buildTestId('eid_pukView_puk_input')}
              name="puk"
              variant="puk"
              control={form.control}
              component={PinInput}
              pinLength={10}
              numRows={2}
            />
          </View>
          <AboutPinLinkSection type="puk" showResetPin={false} />
        </View>
      </ScrollView>
      <EidButtonFooter onNext={onPressSubmit} onCancel={onClose} nextDisabled={!form.formState.isValid} />
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
  contentContainer: {
    flexDirection: 'column',
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
    flexGrow: 1,
  },
  contentText: {
    paddingTop: spacing[7],
    paddingBottom: spacing[6],
    flexWrap: 'wrap',
    color: colors.moonDarkest,
  },
  canView: {
    paddingTop: spacing[9],
    paddingBottom: spacing[13],
  },
})
