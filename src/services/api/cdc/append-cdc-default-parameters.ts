import { createNonce } from '../utils/create-nonce'
import { currentTimestampSecondsAsString } from '../utils/current-timestamp-seconds-as-string'

export const appendCdcDefaultParameters = <InputData>(inputData: InputData) => {
  return {
    ...inputData,
    targetEnv: 'mobile',
    timestamp: currentTimestampSecondsAsString(),
    nonce: createNonce(),
  }
}
