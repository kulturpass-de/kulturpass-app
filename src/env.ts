import { BRIDGE_FC_DEFAULT_TIMEOUT_MS, DEV_MENU, ENVIRONMENTS, AA2_DEVELOPER_MODE, DEBUG_TRANSLATION } from '@env'

if (DEV_MENU === undefined) {
  console.warn('Env variable DEV_MENU is missing. Set to false instead.')
}

if (BRIDGE_FC_DEFAULT_TIMEOUT_MS === undefined) {
  console.warn('Env variable BRIDGE_FC_DEFAULT_TIMEOUT_MS is missing. Using 3000 ms instead.')
}

if (AA2_DEVELOPER_MODE === undefined) {
  console.warn('Env variable AA2_DEVELOPER_MODE is missing. Set to false instead.')
}

export const env = {
  BRIDGE_FC_DEFAULT_TIMEOUT_MS: parseInt(BRIDGE_FC_DEFAULT_TIMEOUT_MS ?? '3000', 10),
  DEV_MENU: (DEV_MENU ?? 'false') === 'true',
  ENVIRONMENTS,
  AA2_DEVELOPER_MODE: (AA2_DEVELOPER_MODE ?? 'false') === 'true',
  DEBUG_TRANSLATION: (DEBUG_TRANSLATION ?? 'false') === 'true',
}
