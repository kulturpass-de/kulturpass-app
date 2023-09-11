import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useState } from 'react'
import { EidParamList, EidScreenProps } from '../../../navigation/eid/types'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../../theme/utils'
import { CancelEidFlowAlert } from '../components/cancel-eid-flow-alert'
import { EidErrorAlert } from '../components/eid-error-alert'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { Flow } from '../types'
import { EidInsertCardRouteName } from './eid-insert-card-route'
import { EidPukScreen } from './eid-puk-screen'

export const EidPukRouteName = 'EidPuk'

export type EidPukRouteParams = {
  flow: Flow
  retry: boolean
}

export type EidPukRouteProps = EidScreenProps<'EidPuk'>

export const EidPukRoute: React.FC<EidPukRouteProps> = ({ route }) => {
  const navigation = useNavigation<StackNavigationProp<EidParamList, 'EidPuk'>>()
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)
  const flow = route.params.flow

  const onNext = useCallback(
    (puk: string) => {
      navigation.navigate(EidInsertCardRouteName, {
        flow,
        puk,
      })
    },
    [flow, navigation],
  )

  const onClose = useCallback(() => {
    setCancelAlertVisible(true)
  }, [])

  useHandleGestures(onClose)

  return (
    <>
      <EidErrorAlert error={null} />
      <CancelEidFlowAlert visible={cancelAlertVisible} onChange={setCancelAlertVisible} />
      <EidPukScreen onClose={onClose} onNext={onNext} retry={route.params.retry} />
    </>
  )
}

export const EidPukRouteConfig = createRouteConfig({
  name: EidPukRouteName,
  component: EidPukRoute,
  options: { cardStyle: modalCardStyle },
})
