import React, { useCallback } from 'react'
import { Control, Controller, ControllerProps, FieldPath } from 'react-hook-form'

export type FormFieldWithControlProps<FieldValues extends {}> = {
  name: FieldPath<FieldValues>
  control: Control<FieldValues>
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
      const { component: Component } = props

      return (
        <Component
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error}
          {...props}
        />
      )
    },
    [props],
  )

  return <Controller name={props.name} render={render} rules={{ required: true }} control={props.control} />
}
