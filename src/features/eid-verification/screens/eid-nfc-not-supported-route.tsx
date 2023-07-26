import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { AA2WorkflowHelper } from '@sap/react-native-ausweisapp2-wrapper'
import React, { useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { RootStackParams } from '../../../navigation/types'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { EidErrorAlert } from '../components/eid-error-alert'
import { useCancelFlow } from '../hooks/use-cancel-flow'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidNFCDisabledScreen } from './eid-nfc-disabled-screen'
import { EidNFCNotSupportedScreen } from './eid-nfc-not-supported-screen'

export const EidNFCNotSupportedRouteName = 'EidNFCNotSupported'

export type EidNFCNotSupportedRouteParams = undefined

export const EidNFCNotSupportedRoute: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>()
  const cancelFlow = useCancelFlow()
  const [nfcIsDisabled, setNfcIsDisabled] = useState<undefined | boolean>(Platform.OS === 'android' ? undefined : false)

  useEffect(() => {
    if (Platform.OS === 'android') {
      AA2WorkflowHelper.isNfcEnabled().then(result => setNfcIsDisabled(result === false))
    }
  }, [])

  const onClose = useCallback(async () => {
    await cancelFlow()
    navigation.navigate('Tabs')
  }, [cancelFlow, navigation])

  useHandleGestures(onClose)

  if (nfcIsDisabled === null) {
    return <LoadingIndicator loading={true} />
  }

  return (
    <>
      <EidErrorAlert error={null} />
      {nfcIsDisabled === false ? (
        <EidNFCNotSupportedScreen onClose={onClose} />
      ) : (
        <EidNFCDisabledScreen onClose={onClose} />
      )}
    </>
  )
}

export const EidNFCNotSupportedRouteConfig = createRouteConfig({
  name: EidNFCNotSupportedRouteName,
  component: EidNFCNotSupportedRoute,
  options: { cardStyle: modalCardStyle },
})
