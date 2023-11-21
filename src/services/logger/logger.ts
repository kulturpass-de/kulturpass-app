import { env } from '../../env'

export interface LoggerType {
  debug(args: any[]): void
  log(args: any[]): void
  warn(args: any[]): void
}

export class Logger implements LoggerType {
  debug(...args: any[]) {
    if (env.DEV_MENU) {
      console.debug(...args)
    }
  }
  log(...args: any[]) {
    if (env.DEV_MENU) {
      console.log(...args)
    }
  }
  warn(...args: any[]) {
    if (env.DEV_MENU) {
      console.warn(...args)
    }
  }
  logRequest(...args: any[]) {
    if (env.DEV_MENU && !env.DEBUG_SKIP_REQUEST_LOGGING) {
      console.log('Request', ...args)
    }
  }
  logResponse(...args: any[]) {
    if (env.DEV_MENU && !env.DEBUG_SKIP_REQUEST_LOGGING) {
      console.log('Response', ...args)
    }
  }
  logRequestError(...args: any[]) {
    if (env.DEV_MENU && !env.DEBUG_SKIP_REQUEST_LOGGING) {
      console.log('Request Error', ...args)
    }
  }
  logError(origin: string, error: unknown, noWarn: boolean = false) {
    if (env.DEV_MENU) {
      if (noWarn) {
        console.log(`${origin} Errored`, JSON.stringify(error))
      } else {
        console.warn(`${origin} Errored`, JSON.stringify(error))
      }
    }
  }
}
