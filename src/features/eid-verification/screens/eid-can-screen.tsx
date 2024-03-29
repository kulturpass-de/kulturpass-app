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
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { useFocusErrors } from '../../form-validation/hooks/use-focus-errors'
import { AboutPinLinkSection } from '../components/about-pin-link-section'
import { EidButtonFooter } from '../components/eid-button-footer'
import { PinInput } from '../components/pin-input'

export type EidCanScreenProps = {
  onNext: (can: string) => void
  onClose: () => void
  retry: boolean
}

export const EidCanScreen: React.FC<EidCanScreenProps> = ({ onNext, onClose, retry }) => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()
  const { t } = useTranslation()

  const form = useForm<{ can: string }>({
    shouldFocusError: false,
    resolver: zodResolver(
      z.object({
        can: z.string().min(6).max(6),
      }),
    ),
  })

  useFocusErrors(form)

  useEffect(() => {
    if (retry) {
      form.setError('can', {
        message: t('eid_canView_invalid_can'),
      })
    } else {
      form.clearErrors('can')
    }
  }, [retry, form, t])

  const onPressSubmit = form.handleSubmit(async values => {
    onNext(values.can)
  })

  return (
    <ModalScreen whiteBottom testID={buildTestId('eid_canView')}>
      <ModalScreenHeader
        testID={buildTestId('eid_canView_title')}
        titleI18nKey="eid_canView_title"
        onPressClose={onClose}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.contentContainer}>
          <TranslatedText
            textStyleOverrides={[styles.contentTitle, { color: colors.labelColor }]}
            testID={buildTestId('eid_canView_content_title')}
            i18nKey="eid_canView_content_title"
            textStyle="HeadlineH4Extrabold"
          />
          <TranslatedText
            testID={buildTestId('eid_canView_content_text')}
            i18nKey="eid_canView_content_text"
            textStyle="BodyRegular"
            textStyleOverrides={{ color: colors.labelColor }}
          />
          <View style={styles.canView}>
            <FormFieldWithControl
              testID={buildTestId('eid_canView_can_input')}
              name="can"
              variant="can"
              control={form.control}
              component={PinInput}
              pinLength={6}
            />
          </View>
          <AboutPinLinkSection type="can" showResetPin={false} />
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
  contentTitle: {
    paddingTop: spacing[6],
    paddingBottom: spacing[2],
    flexWrap: 'wrap',
  },
  canView: {
    paddingTop: spacing[9],
    paddingBottom: spacing[13],
  },
})
