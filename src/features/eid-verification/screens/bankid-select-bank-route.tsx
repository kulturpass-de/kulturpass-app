import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { EidParamList } from '../../../navigation/eid/types'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { BankIdSuggestion } from '../../../services/api/types/commerce/commerce-get-bank-id-suggestions'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { logger } from '../../../services/logger'
import { AppDispatch } from '../../../services/redux/configure-store'
import { modalCardStyle } from '../../../theme/utils'
import { CancelBankidFlowAlert } from '../components/cancel-bankid-flow-alert'
import { EidErrorAlert } from '../components/eid-error-alert'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { startBankIdFlow } from '../redux/thunks/start-bank-id-flow-thunk'
import { BankIdSelectBankScreen } from './bankid-select-bank-screen'
import { EidVerificationCompletionRouteName } from './eid-verification-completion-route'

export const BankIdSelectBankRouteName = 'BankIdSelectBank'

export type BankIdSelectBankRouteParams = undefined

export const BankIdSelectBankRoute: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<EidParamList, 'BankIdSelectBank'>>()
  const [visibleError, setVisibleError] = useState<ErrorWithCode | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)

  const onNext = useCallback(
    async (selectedSuggestion: BankIdSuggestion) => {
      setIsLoading(true)
      try {
        await dispatch(startBankIdFlow(selectedSuggestion.code)).unwrap()
        navigation.replace(EidVerificationCompletionRouteName, { type: 'bankId' })
      } catch (error: unknown) {
        if (error instanceof ErrorWithCode) {
          setVisibleError(error)
        } else {
          logger.warn('Bank ID flow error cannot be interpreted', JSON.stringify(error))
          setVisibleError(new UnknownError('Bank ID flow'))
        }
      } finally {
        setIsLoading(false)
      }
    },
    [dispatch, navigation],
  )

  const onClose = useCallback(() => {
    setCancelAlertVisible(true)
  }, [])

  useHandleGestures(onClose)

  return (
    <>
      <EidErrorAlert error={visibleError} isLoading={isLoading} inEidFlow={false} />
      <CancelBankidFlowAlert visible={cancelAlertVisible} onChange={setCancelAlertVisible} />
      <BankIdSelectBankScreen onClose={onClose} onNext={onNext} />
    </>
  )
}

export const BankIdSelectBankRouteConfig = createRouteConfig({
  name: BankIdSelectBankRouteName,
  component: BankIdSelectBankRoute,
  options: { cardStyle: modalCardStyle },
})
