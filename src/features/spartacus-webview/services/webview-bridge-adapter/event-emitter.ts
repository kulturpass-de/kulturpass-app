import { EventEmitter as ReactNativeEventEmitter } from 'events'

export type Subscription = {
  unsubscribe: () => void
}

export class EventEmitter<EventMap extends {}> {
  protected eventEmitter = new ReactNativeEventEmitter()

  public constructor() {
    /* NOTE: this value might need to be increased if the webview's content
    sends more messages and if we see a warning in the app */
    this.eventEmitter.setMaxListeners(20)
  }

  public addListener<EventType extends Extract<keyof EventMap, string>>(
    eventType: EventType,
    listener: (params: EventMap[EventType]) => void,
  ) {
    this.eventEmitter.addListener(eventType, listener)

    const subscription: Subscription = {
      unsubscribe: () => this.eventEmitter.removeListener(eventType, listener),
    }

    return subscription
  }

  public emit<EventType extends Extract<keyof EventMap, string>>(eventType: EventType, params: EventMap[EventType]) {
    return this.eventEmitter.emit(eventType, params)
  }

  public listenerCount<EventType extends Extract<keyof EventMap, string>>(eventType: EventType) {
    return this.eventEmitter.listenerCount(eventType)
  }

  public removeAllListeners<EventType extends Extract<keyof EventMap, string>>(eventType?: EventType) {
    return this.eventEmitter.removeAllListeners(eventType)
  }
}
