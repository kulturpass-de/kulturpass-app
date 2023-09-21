import { WorkflowMessages } from '@sap/react-native-ausweisapp2-wrapper'
import { useMemo } from 'react'
import { useTranslation } from '../../../services/translation/translation'

export const useWorkflowMessages = (): WorkflowMessages => {
  const { t } = useTranslation()

  return useMemo(
    () => ({
      sessionStarted: t('eid_iosScanDialog_sessionStarted'),
      sessionFailed: t('eid_iosScanDialog_sessionFailed'),
      sessionSucceeded: t('eid_iosScanDialog_sessionSucceeded'),
      sessionInProgress: t('eid_iosScanDialog_sessionInProgress'),
    }),
    [t],
  )
}
