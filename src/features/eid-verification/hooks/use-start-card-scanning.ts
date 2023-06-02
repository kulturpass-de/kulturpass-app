import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import {
  AA2CommandService,
  AA2Messages,
  AA2WorkflowHelper,
  Auth,
  ReaderData,
  Simulator,
} from '@sap/react-native-ausweisapp2-wrapper'
import { Platform } from 'react-native'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import {
  AA2CardDeactivated,
  AA2PukRequired,
  AA2Timeout,
  extractAuthResultUrlQueryError,
  isTimeoutError,
} from '../errors'
import {
  getRandomLastName,
  getSimulateCard,
  getSimulatedCardDate,
  getSimulatedCardName,
} from '../redux/simulated-card-selectors'
import { Flow } from '../types'
import { generateSimulatedCard } from '../utils'
import { useStartAA2ChangePin } from './use-start-change-pin'

type StartCardScanningParams = {
  flow: Flow
  onPinRetry: (retryCounter?: number) => void
  onCanRetry: (canRetry: boolean) => void
  onPukRetry: (pukRetry: boolean) => void
  pin?: string
  newPin?: string
  can?: string
  onAuthSuccess: (url: string) => void
  onChangePinSuccess: () => void
  onError: (error: ErrorWithCode) => void
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
  onAuthSuccess,
  onChangePinSuccess,
  onError,
}: StartCardScanningParams) => {
  const simulateCard = useSelector(getSimulateCard)
  const simulatedCardName = useSelector(getSimulatedCardName)
  const simulatedCardDate = useSelector(getSimulatedCardDate)
  const randomLastName = useSelector(getRandomLastName)

  const [isLoading, setIsLoading] = useState(false)

  const startChangePin = useStartAA2ChangePin()

  useEffect(() => {
    if (simulateCard) {
      const simulatedCardDateInst = simulatedCardDate ? new Date(simulatedCardDate) : undefined
      const simulatedCard: Simulator | undefined =
        simulatedCardName !== undefined
          ? generateSimulatedCard(simulatedCardName, simulatedCardDateInst, randomLastName)
          : undefined
      const sub = AA2WorkflowHelper.handleInsertCard(msg => {
        if (msg.error === undefined) {
          AA2CommandService.setCard('Simulator', simulatedCard)
        }
      })
      return () => sub.unsubscribe()
    }
  }, [randomLastName, simulateCard, simulatedCardDate, simulatedCardName])

  const handleAuth = useCallback(
    (authMsg: Auth) => {
      if (
        authMsg.error === undefined &&
        authMsg.result?.major.endsWith('#error') !== true &&
        authMsg.url !== undefined
      ) {
        const queryError = extractAuthResultUrlQueryError(authMsg)
        if (queryError !== undefined) {
          onError(queryError)
        } else {
          onAuthSuccess(authMsg.url)
        }
      }
    },
    [onAuthSuccess, onError],
  )

  const handleRetry = useCallback(
    async (
      msg: AA2Messages.EnterPin | AA2Messages.EnterCan | AA2Messages.EnterPuk,
      retry: boolean,
      reader?: ReaderData,
    ) => {
      if (Platform.OS === 'ios' && !simulateCard) {
        AA2CommandService.interrupt()
      }
      if (reader?.card?.deactivated === true) {
        onError(new AA2CardDeactivated())
        return
      }
      if (msg === AA2Messages.EnterPin) {
        onPinRetry(reader?.card?.retryCounter)
      } else if (msg === AA2Messages.EnterCan) {
        onCanRetry(retry)
      } else if (msg === AA2Messages.EnterPuk) {
        onError(new AA2PukRequired())
        // onPukRetry(retry)
      }
    },
    [onCanRetry, onError, onPinRetry, simulateCard],
  )

  const enterNewPin = useCallback(async () => {
    if (newPin === undefined) {
      throw new Error('No new PIN provided')
    }

    const changePinResult = await AA2CommandService.setNewPin(simulateCard ? undefined : newPin)
    if (changePinResult.success) {
      onChangePinSuccess()
    }
  }, [newPin, onChangePinSuccess, simulateCard])

  const enterPin = useCallback(async () => {
    // Use 30 seconds timeout, because this step can take a long time
    const result = await AA2CommandService.setPin(simulateCard ? undefined : pin, { msTimeout: 40000 })

    if (result.msg === AA2Messages.EnterNewPin) {
      enterNewPin()
    } else if (result.msg === AA2Messages.Auth) {
      handleAuth(result)
    } else {
      handleRetry(result.msg, result.msg === AA2Messages.EnterPin, result.reader)
    }
  }, [enterNewPin, handleAuth, handleRetry, pin, simulateCard])

  const enterCan = useCallback(async () => {
    if (can === undefined) {
      throw new Error('No CAN provided')
    }
    const result = await AA2CommandService.setCan(can, { msTimeout: 20000 })
    handleRetry(result.msg, result.msg === AA2Messages.EnterCan, result.reader)
  }, [can, handleRetry])

  const handleInitialScan = useCallback(async () => {
    const result = await AA2CommandService.accept({ msTimeout: 20000 })
    handleRetry(result.msg, false, result.reader)
  }, [handleRetry])

  const startScanning = useCallback(async () => {
    setIsLoading(true)
    try {
      const status = await AA2CommandService.getStatus()
      var msg = status.state
      if (status.workflow === null) {
        if (flow === 'ChangePin') {
          const result = await startChangePin()
          msg = result.msg
        }
      }

      switch (msg) {
        case AA2Messages.AccessRights:
          return await handleInitialScan()
        case AA2Messages.EnterPin:
          return await enterPin()
        case AA2Messages.EnterCan:
          return await enterCan()
        case AA2Messages.EnterPuk:
          //return  await enterPuk()
          onError(new AA2PukRequired())
          return
        default:
          throw new Error(`Invalid state ${msg}`)
      }
    } catch (e: unknown) {
      if (
        [AA2Messages.BadState, AA2Messages.InternalError, AA2Messages.Invalid, AA2Messages.UnknownCommand].includes(
          (e as any)?.msg,
        )
      ) {
        // AA2 Message Errors are handled by the useHandleErrors hook
        return
      }

      if (isTimeoutError(e)) {
        onError(new AA2Timeout())
      } else {
        onError(new UnknownError())
      }
    } finally {
      setIsLoading(false)
    }
  }, [enterCan, enterPin, flow, handleInitialScan, onError, startChangePin])

  return { startScanning, isLoading }
}
