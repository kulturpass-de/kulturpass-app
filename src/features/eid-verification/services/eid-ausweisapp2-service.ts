import {
  AA2CommandService,
  AA2Messages,
  AA2WorkflowHelper,
  Auth,
  ReaderData,
  Simulator,
  WorkflowMessages,
  isCardDeactivated,
  isTimeoutError,
} from '@sap/react-native-ausweisapp2-wrapper'
import { Platform } from 'react-native'
import { env } from '../../../env'
import { ErrorWithCode, HttpStatusForbiddenError, UnknownError } from '../../../services/errors/errors'
import { logger } from '../../../services/logger'
import { RootState } from '../../../services/redux/configure-store'
import { createThunk } from '../../../services/redux/utils/create-thunk'
import { AA2_TIMEOUTS } from '../eid-command-timeouts'
import {
  AA2AcceptTimeout,
  AA2CardDeactivated,
  AA2InitError,
  AA2SetPinTimeout,
  AA2Timeout,
  extractAuthResultUrlQueryError,
} from '../errors'
import {
  getRandomLastName,
  getSimulateCard,
  getSimulatedCardDate,
  getSimulatedCardName,
} from '../redux/simulated-card-selectors'
import { createTcTokenUrl } from '../redux/thunks/create-tc-token-url'
import {
  Flow,
  EidRetry,
  EidMessageError,
  EidNFCNotSupported,
  EidAuthSuccess,
  EidFlowResponse,
  EidChangePinSuccess,
  EidUserInput,
  EidAuthFlowStarted,
  EidSDKInitSuccess,
} from '../types'
import { eidMessageToErrorResponse, generateSimulatedCard } from '../utils'

export type CardScanResult = EidMessageError | EidRetry | EidChangePinSuccess | EidAuthSuccess

export class EidAusweisApp2Service {
  /**
   * Initializes the SDK and sets the API Level to 2
   * @returns `EidMessageError | void` EidMessageError is returned, if it was detected.
   * @throws `ErrorWithCode`
   */
  public async initAA2Sdk(): Promise<EidSDKInitSuccess | EidMessageError> {
    try {
      const sdkAlreadyRunning = await AA2CommandService.isRunning()
      if (!sdkAlreadyRunning) {
        await AA2WorkflowHelper.initializeAA2Sdk(
          env.AA2_DEVELOPER_MODE,
          2,
          AA2_TIMEOUTS.INIT,
          AA2_TIMEOUTS.GET_SET_API_LEVEL,
        )
      }
      return { response: EidFlowResponse.EidSDKInitSuccess }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (isTimeoutError(error)) {
          throw new AA2Timeout()
        } else {
          throw new AA2InitError()
        }
      } else {
        return eidMessageToErrorResponse(error)
      }
    }
  }

  /**
   * Checks for the required reader to continue with the Auth flow
   * @param simulateCard is card simulated
   * @returns If the required reader is available
   */
  private async checkIfReaderIsAvailable(simulateCard: boolean): Promise<boolean> {
    const isReaderAvailable = await AA2WorkflowHelper.readerIsAvailable(
      simulateCard,
      'NFC',
      AA2_TIMEOUTS.GET_READER_LIST,
    )
    if (!isReaderAvailable) {
      if (simulateCard) {
        throw new UnknownError('reader not available while simulating card')
      } else {
        return false
      }
    }
    return true
  }

  /**
   * Starts the Auth Flow with the current active user session
   * @throws `ErrorWithCode`
   */
  public startAA2AuthFlow = createThunk<
    EidAuthFlowStarted | EidNFCNotSupported | EidMessageError,
    { messages: WorkflowMessages }
  >(
    'eid/startAA2AuthFlow',
    async (payload, thunkAPI): Promise<EidAuthFlowStarted | EidNFCNotSupported | EidMessageError> => {
      try {
        // 1. Check if the required Reader is available
        const simulateCard = getSimulateCard(thunkAPI.getState())
        const isReaderAvailable = await this.checkIfReaderIsAvailable(simulateCard)

        if (!isReaderAvailable) {
          return {
            response: EidFlowResponse.EidNFCNotSupported,
          }
        }

        // 2. Create the tcTokenUrl pointing to the eID backend.
        const tokenUrl = await thunkAPI.dispatch(createTcTokenUrl()).unwrap()

        // 3. Run the auth workflow in the AusweisApp2 SDK
        const accessRights = await AA2CommandService.runAuth(
          tokenUrl,
          env.AA2_DEVELOPER_MODE,
          false,
          true,
          payload.messages,
          {
            msTimeout: AA2_TIMEOUTS.RUN_AUTH,
          },
        )

        // 4. Request the Certificate Information from the AusweisApp2 SDK
        const certificate = await AA2CommandService.getCertificate({ msTimeout: AA2_TIMEOUTS.GET_CERTIFICATE })

        return { response: EidFlowResponse.EidAuthFlowStarted, accessRights, certificate }
      } catch (error: unknown) {
        if (error instanceof ErrorWithCode) {
          if (error instanceof HttpStatusForbiddenError) {
            throw new AA2InitError()
          } else {
            throw error
          }
        } else if (isTimeoutError(error)) {
          throw new AA2Timeout()
        } else {
          return eidMessageToErrorResponse(error)
        }
      }
    },
  )

  /**
   * Starts the Change Pin Flow
   * @throws AA2 Message
   */
  public async startAA2ChangePinFlow(messages: WorkflowMessages) {
    return await AA2CommandService.changePin(false, true, messages, { msTimeout: AA2_TIMEOUTS.CHANGE_PIN })
  }

  /**
   * Inserts simulated card if AA2 SDK requests a card
   * @returns Subscription if card simulation is active
   */
  private handleCardSimulation(state: RootState) {
    const simulateCard = getSimulateCard(state)
    if (simulateCard) {
      const simulatedCardName = getSimulatedCardName(state)
      const simulatedCardDate = getSimulatedCardDate(state)
      const randomLastName = getRandomLastName(state)

      const simulatedCardDateInst = simulatedCardDate ? new Date(simulatedCardDate) : undefined
      const simulatedCard: Simulator | undefined =
        simulatedCardName !== undefined
          ? generateSimulatedCard(simulatedCardName, simulatedCardDateInst, randomLastName)
          : undefined
      return AA2WorkflowHelper.handleInsertCard(msg => {
        if (msg.error === undefined) {
          AA2CommandService.setCard('Simulator', simulatedCard)
        }
      })
    }
  }

  /**
   * Interrupts the iOS NFC System Dialog, so that the user can interact with the app again.
   * @param simulateCard boolean indicating if a card is simulated
   */
  private interruptNFCSystemDialog(simulateCard: boolean) {
    if (Platform.OS === 'ios' && !simulateCard) {
      AA2CommandService.interrupt()
    }
  }

  /**
   * Interpret the AuthMsg sent by the AA2 SDK.
   * @param authMsg The AuthMsg to be interpreted
   */
  private handleAuthMessage(authMsg: Auth): EidAuthSuccess | EidMessageError {
    // This is already filtered by the library, but better be sure
    if (authMsg.result?.major.endsWith('#error') === true) {
      return eidMessageToErrorResponse(authMsg)
    }

    if (authMsg.url === undefined) {
      throw new UnknownError('Auth Message had no URL')
    }

    /**
     * The Auth workflow succeeded, but the eID backend could still respond
     * with an errorCode in the query parameters.
     * This errorCode is not handled by the useHandleErrors hook, as this is no Auth Workflow error,
     * therefore we handle it here.
     */
    const queryError = extractAuthResultUrlQueryError(authMsg)
    if (queryError !== undefined) {
      throw queryError
    } else {
      return {
        response: EidFlowResponse.EidAuthSuccess,
      }
    }
  }

  /**
   * Handles the AusweisApp2 SDK messages, that lead to another user input screen.
   * This can only occur, if the user needs to input the PIN, CAN or PUK
   * @param simulateCard is card simulated
   * @param msg AusweisApp2 Message, that needs user input
   * @param retry is only true, if the user was already requested for that input and an error needs to be shown
   * @param reader data of the AusweisApp2 Message, that might contain a retry counter (PIN only)
   * @returns The respective eid retry response
   * @throws AA2 Message | `ErrorWithCode`
   */
  private handleRetry(
    simulateCard: boolean,
    msg: AA2Messages.EnterPin | AA2Messages.EnterCan | AA2Messages.EnterPuk,
    retry: boolean,
    reader?: ReaderData,
  ): EidRetry {
    this.interruptNFCSystemDialog(simulateCard)
    if (reader !== undefined && isCardDeactivated(reader.card)) {
      throw new AA2CardDeactivated()
    }

    if (msg === AA2Messages.EnterPin) {
      return {
        response: EidFlowResponse.RetryPin,
        retryCounter:
          reader !== undefined && reader.card !== null && 'retryCounter' in reader.card
            ? reader.card.retryCounter
            : undefined,
      }
    } else if (msg === AA2Messages.EnterCan) {
      return {
        response: EidFlowResponse.RetryCan,
        retry,
      }
    } else if (msg === AA2Messages.EnterPuk) {
      return {
        response: EidFlowResponse.RetryPuk,
        retry,
      }
    } else {
      // Msg parameter is invalid in that case. This should never be reached.
      throw new UnknownError('Eid Retry Case Unknown')
    }
  }

  /**
   * Handles the AusweisApp2 EnterNewPin Message, by setting the newPin.
   * The ChangePin Response holds a success property that this function returns.
   * As the new pin screen should validate the entered pin, this should not be unsuccessful.
   * @param simulateCard is card simulated
   * @param newPin The newPin that was given by the user
   * @returns EidChangePinSuccess if succeeded and EidMessageError if failed
   * @throws AA2 Message | `ErrorWithCode`
   */
  private async handleEnterNewPin(
    simulateCard: boolean,
    newPin?: string,
  ): Promise<EidChangePinSuccess | EidMessageError> {
    if (newPin === undefined) {
      // This must not occur.
      throw new UnknownError('No new PIN provided')
    }

    const changePinResult = await AA2CommandService.setNewPin(simulateCard ? undefined : newPin, {
      msTimeout: AA2_TIMEOUTS.SET_NEW_PIN,
    })

    if (changePinResult.success === true) {
      return {
        response: EidFlowResponse.EidChangePinSuccess,
      }
    } else {
      // This is already filtered by the library, but better be sure
      return eidMessageToErrorResponse(changePinResult)
    }
  }

  /**
   * Handles the AusweisApp2 EnterPin Message, by setting the pin.
   * @param simulateCard is card simulated
   * @param flow The current flow (Auth or ChangePin)
   * @param pin The pin input by the user
   * @param newPin The new pin entered by the user (Change Pin Only)
   * @throws AA2 Message | `ErrorWithCode`
   */
  private async handleEnterPin(
    simulateCard: boolean,
    flow: Flow,
    pin?: string,
    newPin?: string,
  ): Promise<CardScanResult> {
    try {
      const result = await AA2CommandService.setPin(simulateCard ? undefined : pin, {
        msTimeout: AA2_TIMEOUTS.SET_PIN,
      })

      if (result.msg === AA2Messages.EnterNewPin) {
        return await this.handleEnterNewPin(simulateCard, newPin)
      } else if (result.msg === AA2Messages.Auth) {
        return this.handleAuthMessage(result)
      } else {
        return this.handleRetry(simulateCard, result.msg, result.msg === AA2Messages.EnterPin, result.reader)
      }
    } catch (e) {
      if (isTimeoutError(e) && flow === 'Auth') {
        // As the Timeout Error is not thrown by the SDK, we need to interrupt the ios scanning dialog
        this.interruptNFCSystemDialog(simulateCard)
        throw new AA2SetPinTimeout()
      } else {
        throw e
      }
    }
  }

  /**
   * Handles the AusweisApp2 EnterCan Message, by setting the can.
   * @param simulateCard is card simulated
   * @param can The can input by the user
   * @returns The next retry case
   * @throws AA2 Message | `ErrorWithCode`
   */
  private async handleEnterCan(simulateCard: boolean, can?: string): Promise<EidRetry> {
    if (can === undefined) {
      throw new UnknownError('No CAN provided')
    }
    const result = await AA2CommandService.setCan(can, {
      msTimeout: AA2_TIMEOUTS.SET_CAN,
    })

    // After Entering the CAN, only ENTER_CAN or ENTER_PIN can follow. Therefore a retry is handled.
    return this.handleRetry(simulateCard, result.msg, result.msg === AA2Messages.EnterCan, result.reader)
  }

  /**
   * Handles the AusweisApp2 EnterPuk Message, by setting the puk.
   * @param simulateCard is card simulated
   * @param puk The puk input by the user
   * @returns The next retry case
   * @throws AA2 Message | `ErrorWithCode`
   */
  private async handleEnterPuk(simulateCard: boolean, puk?: string): Promise<EidRetry> {
    if (puk === undefined) {
      throw new UnknownError('No CAN provided')
    }
    const result = await AA2CommandService.setPuk(puk, {
      msTimeout: AA2_TIMEOUTS.SET_PUK,
    })

    // After Entering the Puk, only ENTER_PUK or ENTER_PIN can follow. Therefore a retry is handled.
    return this.handleRetry(simulateCard, result.msg, result.msg === AA2Messages.EnterPuk, result.reader)
  }

  /**
   * Handles the initial scan in the Auth flow. It is started by accepting the access rights.
   * @param simulateCard is card simulated
   * @returns The next retry case
   * @throws AA2 Message | `ErrorWithCode`
   */
  private async handleInitialAuthScan(simulateCard: boolean): Promise<EidRetry> {
    try {
      const result = await AA2CommandService.accept({
        msTimeout: AA2_TIMEOUTS.ACCEPT,
      })
      // After accepting, the first scan happens. This is always followed by a RetryResponse.
      return this.handleRetry(simulateCard, result.msg, false, result.reader)
    } catch (error) {
      if (isTimeoutError(error)) {
        // As the Timeout Error is not thrown by the SDK, we need to interrupt the ios scanning dialog
        this.interruptNFCSystemDialog(simulateCard)
        throw new AA2AcceptTimeout()
      } else {
        throw error
      }
    }
  }

  /**
   * Handles the initial scan in the Change Pin flow. The first scan starts directly after starting the Change Pin flow.
   * @param simulateCard is card simulated
   * @returns The next retry case
   * @throws `ErrorWithCode`
   */
  private async handleInitialChangePinScan(simulateCard: boolean, messages: WorkflowMessages): Promise<EidRetry> {
    const result = await this.startAA2ChangePinFlow(messages)
    return this.handleRetry(simulateCard, result.msg, false, result.reader)
  }

  /**
   * Start the scanning Process. This is used in all the Scanning screen and therefore fulfills multiple purposes.
   * Most importantly the initial scan is handled here after the AccessRights Screen
   * and the Scanning screen after the user entered the pin, but also other cases such as validating CAN/PUK or changing
   * the pin need this function. In all cases the function works, such that the scanning flow will be started and
   * the user will need to scan the eID. After that either new user input is needed or the current flow finished
   * @param flow The current flow (Auth or ChangePin).
   * @param userInput An object containing the user input needed for the scan, such as pin, newPin, can or puk.
   * @throws `ErrorWithCode`
   * @returns EidMessageError | EidRetry | EidChangePinSuccess | EidAuthSuccess
   */
  public startScanning = createThunk<
    CardScanResult,
    { flow: Flow; userInput: EidUserInput; messages: WorkflowMessages }
  >('eid/startScanning', async (payload, thunkAPI): Promise<CardScanResult> => {
    const { flow, userInput } = payload
    const state = thunkAPI.getState()
    const simulateCard = getSimulateCard(state)
    const simulationCardHandlerSub = this.handleCardSimulation(state)
    try {
      // Check the current active Workflow.
      const status = await AA2CommandService.getStatus({
        msTimeout: AA2_TIMEOUTS.GET_STATUS,
      })
      const msg = status.state
      if (status.workflow === null) {
        if (flow === 'ChangePin') {
          // We did not start the ChangePin worklow yet, as this instantly shows the system UI for Card Scanning
          return await this.handleInitialChangePinScan(simulateCard, payload.messages)
        }
      }

      switch (msg) {
        case AA2Messages.AccessRights:
          return await this.handleInitialAuthScan(simulateCard)
        case AA2Messages.EnterPin:
          return await this.handleEnterPin(simulateCard, flow, userInput.pin, userInput.newPin)
        case AA2Messages.EnterCan:
          return await this.handleEnterCan(simulateCard, userInput.can)
        case AA2Messages.EnterPuk:
          return await this.handleEnterPuk(simulateCard, userInput.puk)
        default:
          throw new UnknownError(`Invalid state ${msg}`)
      }
    } catch (error: unknown) {
      // Check the expected error AA2 Messages, that normally occur.
      if (
        [
          AA2Messages.BadState,
          AA2Messages.InternalError,
          AA2Messages.Invalid,
          AA2Messages.UnknownCommand,
          AA2Messages.Auth,
          AA2Messages.ChangePin,
          AA2Messages.Reader,
        ].includes((error as any)?.msg)
      ) {
        return eidMessageToErrorResponse(error)
      } else if (isTimeoutError(error)) {
        // As the Timeout Error is not thrown by the SDK, we need to interrupt the ios scanning dialog
        this.interruptNFCSystemDialog(simulateCard)
        throw new AA2Timeout()
      } else if (error instanceof ErrorWithCode) {
        throw error
      } else {
        logger.warn('eID scan error can not be interpreted', JSON.stringify(error))
        throw new UnknownError('eID Scan')
      }
    } finally {
      if (simulationCardHandlerSub !== undefined) {
        simulationCardHandlerSub.unsubscribe()
      }
    }
  })

  /**
   * Cancels the current AA2 flow.
   */
  public async cancelFlow() {
    try {
      await AA2CommandService.cancel({ msTimeout: AA2_TIMEOUTS.CANCEL })
    } catch (error: unknown) {
      logger.warn('eID error while cancelling the current Flow', JSON.stringify(error))
    }
  }

  /**
   * Cancel any ongoing flow, stop the AA2 SDK and disables NFC Card detection on Android.
   */
  public async stopSDK() {
    try {
      await AA2CommandService.stop({ msTimeout: AA2_TIMEOUTS.STOP })
    } catch (error: unknown) {
      logger.warn('eID error while stopping AA2 SDK', JSON.stringify(error))
    }
  }
}

export const eidAusweisApp2Service = new EidAusweisApp2Service()
