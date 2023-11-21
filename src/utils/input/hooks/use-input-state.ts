import { useCallback, useState } from 'react'
import { TextInputProps } from 'react-native'

type Options = undefined | Pick<TextInputProps, 'onFocus' | 'onBlur'>

export const useInputState = (options: Options = undefined) => {
  const [state, setState] = useState<{ isFocused?: boolean }>({})

  const handleBlur: NonNullable<TextInputProps['onBlur']> = useCallback(
    event => {
      setState(currentState => ({ ...currentState, isFocused: false }))
      options?.onBlur?.(event)
    },
    [options],
  )

  const handleFocus: NonNullable<TextInputProps['onFocus']> = useCallback(
    event => {
      setState(currentState => ({ ...currentState, isFocused: true }))
      options?.onFocus?.(event)
    },
    [options],
  )

  return {
    state,
    setState,
    handleBlur,
    handleFocus,
  }
}
