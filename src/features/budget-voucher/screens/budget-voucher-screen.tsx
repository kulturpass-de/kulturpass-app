import React, { useEffect, useState } from 'react'
import { useWatch } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { Button } from '../../../components/button/button'
import { LinkText } from '../../../components/link-text/link-text'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { ScreenContent } from '../../../components/screen/screen-content'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { commerceApi } from '../../../services/api/commerce-api'
import { Price } from '../../../services/api/types/commerce/api-types'
import { HttpError } from '../../../services/errors/errors'
import { useFaqLink } from '../../../services/faq-configuration/hooks/use-faq-link'
import { logger } from '../../../services/logger'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { BudgetVoucherInput } from '../components/budget-voucher-input'
import { BudgetVoucherErrorType, budgetVoucherErrorTypes } from '../errors/budget-voucher-errors'
import { useBudgetVoucherForm } from '../hooks/use-budget-voucher-form'

type BudgetVoucherScreenProps = {
  onClose: () => void
  onNext: (price: Price) => void
  error?: {
    type?: BudgetVoucherErrorType
  }
}

export const BudgetVoucherScreen: React.FC<BudgetVoucherScreenProps> = props => {
  const { onClose, onNext, error } = props

  const { colors } = useTheme()

  const budgetVoucherUrl = useFaqLink('ABOUT_BUDGET_VOUCHERS')

  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const screenTestID = buildTestId('budget_voucher')

  const { form } = useBudgetVoucherForm()

  const [submitLoading, setSubmitLoading] = useState(false)

  const { t } = useTranslation()

  const [budgetVoucherRedemptionQuery] = commerceApi.usePostBudgetVoucherRedemptionMutation()

  const onSubmit = form.handleSubmit(async data => {
    setSubmitLoading(true)
    try {
      const response = await budgetVoucherRedemptionQuery(data).unwrap()
      onNext({ value: response.amount, currencyIso: response.currency })
    } catch (e: unknown) {
      if (e instanceof HttpError && e.errors?.length) {
        const errorType = e.errors[0].type

        if (budgetVoucherErrorTypes.includes(errorType as BudgetVoucherErrorType)) {
          form.setError('voucherCode', {
            message: t(`budget_voucher_error_${e.errors[0].type}` as AvailableTranslations),
            type: 'value',
          })
        } else {
          form.setError('voucherCode', {
            message: t(`form_error_${e.errors[0].type}` as AvailableTranslations),
            type: 'value',
          })
        }
      } else {
        logger.warn('BudgetVoucherScreen onSubmit error', JSON.stringify(error))
      }
    } finally {
      setSubmitLoading(false)
    }
  })

  useEffect(() => {
    if (error !== undefined) {
      form.setError('voucherCode', {
        message: t(`budget_voucher_error_${error.type}` as AvailableTranslations),
        type: 'value',
      })
    }
  }, [error, form, t])

  const formState = useWatch(form)
  const emptyInput = Boolean(!formState?.voucherCode?.length)

  return (
    <ModalScreen testID={screenTestID}>
      <ModalScreenHeader
        titleI18nKey="budget_voucher_headline"
        testID={addTestIdModifier(screenTestID, 'headline')}
        onPressClose={onClose}
      />
      <ScreenContent style={styles.screenContent}>
        <TranslatedText
          i18nKey="budget_voucher_content_title"
          textStyle="HeadlineH4Extrabold"
          accessibilityRole="header"
          testID="budget_voucher_content_title"
          textStyleOverrides={[styles.title, { color: colors.labelColor }]}
        />

        <TranslatedText
          i18nKey="budget_voucher_text_1"
          textStyle="BodyRegular"
          testID="budget_voucher_text_1"
          textStyleOverrides={[styles.text1, { color: colors.labelColor }]}
        />

        <View style={styles.input}>
          <BudgetVoucherInput form={form} />
        </View>

        <TranslatedText
          i18nKey="budget_voucher_text_2"
          textStyle="BodyRegular"
          testID="budget_voucher_text_2"
          textStyleOverrides={[styles.text2, { color: colors.labelColor }]}
        />

        <View style={styles.linkContainer}>
          <LinkText
            link={budgetVoucherUrl}
            i18nKey="budget_voucher_link"
            textStyle="BodyMedium"
            testID={addTestIdModifier(screenTestID, 'link')}
          />
        </View>
      </ScreenContent>

      <ModalScreenFooter ignorePaddingWithSafeArea={false}>
        <Button
          disabled={submitLoading || emptyInput}
          testID={addTestIdModifier(screenTestID, 'submit')}
          i18nKey="budget_voucher_continue"
          onPress={onSubmit}
        />

        <Button
          disabled={submitLoading}
          testID={addTestIdModifier(screenTestID, 'cancel')}
          i18nKey="budget_voucher_cancel"
          variant="transparent"
          onPress={onClose}
        />
      </ModalScreenFooter>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  screenContent: {
    marginTop: spacing[6],
    paddingHorizontal: spacing[5],
  },
  title: { marginBottom: spacing[1] },
  text1: { marginBottom: spacing[8] },
  input: { marginBottom: spacing[8] },
  text2: { marginBottom: spacing[1], paddingBottom: spacing[8] },
  linkContainer: { flexGrow: 1, justifyContent: 'flex-end', paddingBottom: spacing[8] },
})
