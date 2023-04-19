import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useTranslation } from '../../../services/translation/translation'
import { useFocusEffect } from '@react-navigation/native'

export const usePinFormValidation = (
  maxRetries: number,
  pinLength: number,
  onNext: (pin: string) => void,
  retryCounter?: number,
) => {
  const form = useForm<{ pin: string }>({
    resolver: zodResolver(
      z.object({
        pin: z.string().min(pinLength).max(pinLength),
      }),
    ),
  })
  const { t } = useTranslation()

  useFocusEffect(
    useCallback(() => {
      form.setValue('pin', '')
    }, [form]),
  )

  const onPressSubmit = form.handleSubmit(values => {
    onNext(values.pin)
  })

  useEffect(() => {
    if ((retryCounter ?? maxRetries) < maxRetries) {
      form.setError('pin', {
        message: t(retryCounter === 1 ? 'eid_pinView_invalid_pin_one' : 'eid_pinView_invalid_pin', {
          attemptsRemaining: retryCounter,
        }),
      })
    } else {
      form.clearErrors('pin')
    }
  }, [retryCounter, form, t, maxRetries])

  return { form, onPressSubmit }
}
