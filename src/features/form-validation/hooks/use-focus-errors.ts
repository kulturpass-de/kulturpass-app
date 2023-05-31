import { useEffect } from 'react'
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { AccessibilityInfo } from 'react-native'

import { useTranslation } from '../../../services/translation/translation'

export const FORM_HAS_ERRORS_ANNOUNCEMENT_DURATION = 2000

export const useFocusErrors = <T extends FieldValues>(form: UseFormReturn<T>) => {
  const { t } = useTranslation()
  const announcement = t('error_alert_message_fallback')

  useEffect(() => {
    const asyncEffect = async () => {
      const fieldsWithErrors = Object.keys(form.formState.errors) as Path<T>[]

      if (fieldsWithErrors.length > 0) {
        const isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled()

        if (!isScreenReaderEnabled) {
          form.setFocus(fieldsWithErrors[0])
          return
        }

        AccessibilityInfo.announceForAccessibility(announcement)

        setTimeout(() => {
          // NOTE: `form.setFocus()` will trigger the announcement of the provided field and will stop / interupt
          // `AccessibilityInfo.announceForAccessibility()`, so in order to mitigate this we use a `setTimeout`.
          // Unfortunately `AccessibilityInfo.addEventListener('announcementFinished')` did not work for this case.
          form.setFocus(fieldsWithErrors[0])
        }, FORM_HAS_ERRORS_ANNOUNCEMENT_DURATION)
      }
    }

    asyncEffect()
  }, [form, form.formState.errors, announcement])
}
