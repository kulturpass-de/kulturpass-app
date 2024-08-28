import React from 'react'
import { Pressable, StyleSheet, TextInput } from 'react-native'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { spacing } from '../../theme/spacing'
import { SvgImage } from '../svg-image/svg-image'
import { AvailableTranslations } from '../translated-text/types'
import { TextFormField, TextFormFieldProps } from './text-form-field'

type SearchFormField = TextFormFieldProps & { onClear?: () => void; accessibilityLabelI18nKey?: AvailableTranslations }

export const SearchFormField = React.forwardRef<TextInput, SearchFormField>(
  ({ onClear, accessibilityLabelI18nKey, ...textFormFieldProps }, ref) => {
    const { t } = useTranslation()
    const { addTestIdModifier } = useTestIdBuilder()

    return (
      <TextFormField ref={ref} {...textFormFieldProps} accessibilityRole="search">
        <Pressable
          style={[styles.inputIcon]}
          onPress={onClear}
          accessible
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabelI18nKey && t(accessibilityLabelI18nKey)}
          testID={addTestIdModifier(textFormFieldProps.testID, 'clearSearchTextButton')}>
          {!textFormFieldProps?.value?.length ? (
            <SvgImage type={'search-input'} width={24} height={24} />
          ) : (
            <SvgImage type={'x-circle'} width={24} height={24} />
          )}
        </Pressable>
      </TextFormField>
    )
  },
)

const styles = StyleSheet.create({
  inputIcon: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    right: spacing[5],
  },
  hidden: {
    display: 'none',
  },
})
