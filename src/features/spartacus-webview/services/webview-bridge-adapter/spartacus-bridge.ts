/* eslint-disable @typescript-eslint/no-shadow */

export namespace SpartacusBridge {
  export type Serializable =
    | number
    | string
    | bigint
    | boolean
    | null
    | undefined
    | void
    | Serializable[]
    | { [key: string]: Serializable }

  export type StateChangeSource = string

  interface SerializableObject {
    [key: string]: Serializable
  }

  export interface Message extends SerializableObject {}

  export interface SerializableError extends SerializableObject {
    type?: string
    message: string
    errorCode?: string
    detailCode?: string
  }

  export namespace FunctionCall {
    export enum Target {
      AuthLogin = 'auth.login',
      AuthLogout = 'auth.logout',
      GeolocationSetLocation = 'geolocation.setLocation',
      RouterNavigate = 'router.navigate',
    }
    export type Arguments = Serializable[]
    export type ResultValue = Serializable

    export interface Request<T extends Target, A extends Arguments> extends Message {
      id: string
      target: T
      arguments: A
    }

    export interface Result<V extends ResultValue> extends Message {
      id: string
      value?: V
      error?: SerializableError
    }

    export namespace AuthLogin {
      export type Arguments = [{ access_token: string }]
      export type ResultValue = void
      export type Signature = (...args: Arguments) => Promise<ResultValue>
      export interface Request extends FunctionCall.Request<Target.AuthLogin, Arguments> {}
      export interface Result extends FunctionCall.Result<ResultValue> {}
    }

    export namespace AuthLogout {
      export type Arguments = []
      export type ResultValue = void
      export type Signature = (...args: Arguments) => Promise<ResultValue>
      export interface Request extends FunctionCall.Request<Target.AuthLogout, Arguments> {}
      export interface Result extends FunctionCall.Result<ResultValue> {}
    }

    export namespace GeolocationSetLocation {
      export type Arguments = [latitude: number, longitude: number]
      export type ResultValue = void
      export type Signature = (...args: Arguments) => Promise<ResultValue>
      export interface Request extends FunctionCall.Request<Target.GeolocationSetLocation, Arguments> {}
      export interface Result extends FunctionCall.Result<ResultValue> {}
    }

    export namespace RouterNavigate {
      export type Arguments = [commands: string[]]
      export type ResultValue = void
      export type Signature = (...args: Arguments) => Promise<ResultValue>
      export interface Request extends FunctionCall.Request<Target.RouterNavigate, Arguments> {}
      export interface Result extends FunctionCall.Result<ResultValue> {}
    }
  }

  export namespace EventForwarding {
    export enum Source {
      RouterEvents = 'router.events',
      Bridge = 'bridge',
    }
    export interface Event extends Message {
      source: Source
      name: string
      data: Serializable
    }

    export interface RouterEvent extends Event {
      source: Source.RouterEvents
      data: {
        id: number
        url: string
      }
    }
  }

  export namespace StateForwarding {
    export enum Source {
      AuthIsUserLoggedIn = 'auth.isUserLoggedIn',
    }
    export interface StateChange extends Message {
      source: Source
      value: Serializable
    }
  }
}
