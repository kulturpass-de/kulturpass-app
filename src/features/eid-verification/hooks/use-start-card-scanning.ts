import { aa2Module } from '@jolocom/react-native-ausweis'
import { Messages } from '@jolocom/react-native-ausweis/js/messageTypes'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { getSimulateCard, getSimulatedCardName } from '../redux/simulated-card-selectors'
import { useCancelFlow } from './use-cancel-flow'
import { useStartAA2ChangePin } from './use-start-change-pin'
import { Flow } from '../types'
import { Platform } from 'react-native'

type StartCardScanningParams = {
  flow: Flow
  onPinRetry: (retryCounter?: number) => void
  onCanRetry: () => void
  onPukRetry: () => void
  pin?: string
  newPin?: string
  can?: string
  onAuthSuccess: (url: string) => void
  onChangePinSuccess: () => void
}

/**
 * Returns function to handle the complete scanning process and its edge cases.
 */
export const useStartCardScanning = ({
  flow,
  pin,
  can,
  newPin,
  onPinRetry,
  onCanRetry,
  onPukRetry,
  onAuthSuccess,
  onChangePinSuccess,
}: StartCardScanningParams) => {
  const simulateCard = useSelector(getSimulateCard)
  const simulatedCardName = useSelector(getSimulatedCardName)

  const [isLoading, setIsLoading] = useState(false)

  const cancelFlow = useCancelFlow()

  const startChangePin = useStartAA2ChangePin()

  useEffect(() => {
    aa2Module.setHandlers({
      handleAuthSuccess: onAuthSuccess,
    })

    return () => {
      aa2Module.setHandlers({
        handleAuthSuccess: undefined,
      })
    }
  }, [cancelFlow, onAuthSuccess])

  useEffect(() => {
    if (simulateCard) {
      const simulatedCard =
        simulatedCardName !== undefined
          ? {
              files: require('../../../screens/developer-settings/simulation-cards/simulation-cards').simulationCards[
                simulatedCardName
              ],
            }
          : undefined
      aa2Module.setHandlers({
        handleCardRequest: () => {
          aa2Module.setCard('Simulator', simulatedCard)
        },
      })
      return () => {
        aa2Module.setHandlers({
          handleCardRequest: undefined,
        })
      }
    }
  }, [simulateCard, simulatedCardName])

  const handleRetry = useCallback(
    async (msg: string, retryCounter?: number) => {
      if (
        [Messages.enterPin, Messages.enterCan, Messages.enterPuk].includes(msg as Messages) &&
        Platform.OS === 'ios' &&
        !simulateCard
      ) {
        await aa2Module.interruptFlow()
      }
      if (msg === Messages.enterPin) {
        onPinRetry(retryCounter)
      } else if (msg === Messages.enterCan) {
        onCanRetry()
      } else if (msg === Messages.enterPuk) {
        onPukRetry()
      }
    },
    [onCanRetry, onPinRetry, onPukRetry, simulateCard],
  )

  const enterNewPin = useCallback(async () => {
    if (newPin === undefined) {
      throw new Error('No new PIN provided')
    }

    const changePinResult = await aa2Module.setNewPin(simulateCard ? undefined : newPin)
    if (changePinResult.success === true) {
      onChangePinSuccess()
    }
  }, [newPin, onChangePinSuccess, simulateCard])

  const enterPin = useCallback(async () => {
    const result = await aa2Module.setPin(simulateCard ? undefined : pin)
    const msg: string = result.msg

    if (msg === Messages.enterNewPin && newPin !== undefined) {
      enterNewPin()
    } else {
      const retryCounter = result.reader?.card?.retryCounter
      handleRetry(msg, retryCounter)
    }
  }, [enterNewPin, handleRetry, newPin, pin, simulateCard])

  const enterCan = useCallback(async () => {
    if (can === undefined) {
      throw new Error('No CAN provided')
    }
    await aa2Module.setCan(can)
    enterPin()
  }, [can, enterPin])

  const handleInitialScan = useCallback(async () => {
    const result = await aa2Module.acceptAuthRequest()
    const msg: any = result.msg
    if (msg === Messages.enterPin && pin !== undefined) {
      await enterPin()
    } else {
      const retryCounter = (result as any).reader?.card?.retryCounter
      handleRetry(msg, retryCounter)
    }
  }, [enterPin, handleRetry, pin])

  const startScanning = useCallback(async () => {
    setIsLoading(true)
    const status = await aa2Module.getStatus()
    var msg: string | null = status.state
    if (status.workflow === null) {
      if (flow === 'ChangePin') {
        const result = await startChangePin()
        msg = result.msg
      }
    }

    switch (msg) {
      case Messages.accessRights:
        return await handleInitialScan()
      case Messages.enterPin:
        return await enterPin()
      case Messages.enterCan:
        return await enterCan()
      case Messages.enterPuk:
        return //TODO: await enterPuk()
      default:
        throw new Error(`Invalid state ${msg}`)
    }
  }, [enterCan, enterPin, flow, handleInitialScan, startChangePin])

  return { startScanning, isLoading }
}
