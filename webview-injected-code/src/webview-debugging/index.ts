import { logToBridge } from '../utils'

/**
 * Forwards all calls to the console in the webview to the native side
 */
try {
  logToBridge('log', ['Patching console with bridge events'])
  const consoleOrig = console

  const consoleLog = (type: 'log' | 'debug' | 'info' | 'warn' | 'error', ...log: any[]) => {
    if (!Array.isArray(log) || log.length === 0) {
      return
    }
    consoleOrig[type](...log)
    logToBridge(type, log)
  }

  console = {
    ...consoleOrig,
    log: (...log) => consoleLog('log', ...log),
    debug: (...log) => consoleLog('debug', ...log),
    info: (...log) => consoleLog('info', ...log),
    warn: (...log) => consoleLog('warn', ...log),
    error: (...log) => consoleLog('error', ...log),
  }
} catch (error: unknown) {
  logToBridge('error', ['Patching console log failed', JSON.stringify(error)])
}
