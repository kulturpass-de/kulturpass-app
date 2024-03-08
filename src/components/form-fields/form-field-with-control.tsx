import React, { useCallback } from 'react'
import { Control, Controller, ControllerProps, FieldPath } from 'react-hook-form'
import { View } from 'react-native'
import { MandatoryFieldHint } from './mandatory-field-hint'

export type FormFieldWithControlProps<FieldValues extends {}> = {
  name: FieldPath<FieldValues>
  control: Control<FieldValues>
  disabled?: boolean
  displayMandatoryFieldHint?: boolean
}

export const FormFieldWithControl = <
  FieldValues extends {},
  Component extends React.ElementType,
  ComponentProps extends React.ComponentProps<Component> extends infer U ? U : unknown,
>(
  props: FormFieldWithControlProps<FieldValues> & {
    component: React.FC<ComponentProps>
  } & ComponentProps,
): React.ReactElement => {
  const render: ControllerProps<FieldValues>['render'] = useCallback(
    ({ field, fieldState }) => {
      const { component: Component, disabled = false } = props

      return (
        <Component
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          ref={field.ref}
          error={fieldState.error}
          editable={!disabled}
          {...props}
        />
      )
    },
    [props],
  )

  return (
    <View>
      <Controller name={props.name} render={render} rules={{ required: true }} control={props.control} />
      {props.displayMandatoryFieldHint ? <MandatoryFieldHint /> : null}
    </View>
  )
}
