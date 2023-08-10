import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { StyleSheet, View } from 'react-native'
import { z } from 'zod'
import { Button } from '../../../../components/button/button'
import { Divider } from '../../../../components/divider/divider'
import { FormFieldWithControl } from '../../../../components/form-fields/form-field-with-control'
import { TextFormField } from '../../../../components/form-fields/text-form-field'
import { TranslatedText } from '../../../../components/translated-text/translated-text'
import { commerceApi } from '../../../../services/api/commerce-api'
import { useTestIdBuilder } from '../../../../services/test-id/test-id'
import { useTranslation } from '../../../../services/translation/translation'
import { useTheme } from '../../../../theme/hooks/use-theme'
import { spacing } from '../../../../theme/spacing'
import { POSTAL_CODE_SCHEMA } from '../../../form-validation/utils/form-validation'

export type PostalCodeSectionProps = {
  defaultPostalCode?: string
  onSubmit: (postalCode: string) => void
}

export type PostalCodeSectionFormData = {
  postalCode: string
}

export const PostalCodeSection = ({ defaultPostalCode, onSubmit }: PostalCodeSectionProps) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()

  const [getIsValidPostalCode] = commerceApi.useLazyGetIsValidPostalCodeQuery()

  const form = useForm<PostalCodeSectionFormData>({
    shouldFocusError: false,
    mode: 'onChange',
    resolver: zodResolver(
      z.object({
        postalCode: z.literal('').or(POSTAL_CODE_SCHEMA(t, getIsValidPostalCode, true)),
      }),
    ),
    defaultValues: {
      postalCode: defaultPostalCode,
    },
  })

  const submit = form.handleSubmit(values => {
    onSubmit(values.postalCode)
  })

  return (
    <View style={styles.container}>
      <FormFieldWithControl
        name="postalCode"
        component={TextFormField}
        labelI18nKey="offerSelectionFilter_postalCode_input_label"
        testID={buildTestId('offerSelectionFilter_postalCode_input')}
        control={form.control}
        maxLength={5}
        keyboardType="number-pad"
      />
      <Divider marginTop={spacing[2]} marginBottom={spacing[3]} />
      <TranslatedText
        textStyle="CaptionSemibold"
        textStyleOverrides={[styles.hint, { color: colors.labelColor }]}
        i18nKey="offerSelectionFilter_hint"
        testID={buildTestId('offerSelectionFilter_hint')}
      />
      <Button i18nKey="offerSelectionFilter_submit_button_label" onPress={submit} disabled={!form.formState.isValid} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing[5],
  },
  hint: {
    marginBottom: spacing[6],
  },
})
