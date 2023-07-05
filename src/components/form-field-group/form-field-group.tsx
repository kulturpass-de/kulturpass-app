import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { TestId, useTestIdBuilder } from '../../services/test-id/test-id'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { FormFieldWithControlProps } from '../form-fields/form-field-with-control'
import { TranslatedText } from '../translated-text/translated-text'
import { AvailableTranslations } from '../translated-text/types'

export type FormFieldGroupProps = {
  i18nKey: AvailableTranslations
  i18nParams?: {}
  testID: TestId
  children: React.ReactElement<FormFieldWithControlProps<any>>[]
  containerStyle?: ViewStyle
}

export const FormFieldGroup: React.FC<FormFieldGroupProps> = ({
  i18nKey,
  i18nParams,
  testID,
  children: formFields,
  containerStyle = {},
}) => {
  const { addTestIdModifier } = useTestIdBuilder()

  return (
    <View testID={testID} style={containerStyle}>
      <TranslatedText
        testID={addTestIdModifier(testID, 'caption')}
        i18nKey={i18nKey}
        i18nParams={i18nParams}
        textStyle={'SubtitleSemibold'}
        textStyleOverrides={styles.groupCaption}
      />
      {formFields}
    </View>
  )
}

const styles = StyleSheet.create({
  groupCaption: {
    marginTop: spacing[2],
    marginBottom: spacing[6],
    color: colors.moonDarkest,
  },
})
