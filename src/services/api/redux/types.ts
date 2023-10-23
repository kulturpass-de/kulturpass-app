import { commerceApi } from '../commerce-api'

type CommerceApiEndpoints = (typeof commerceApi)['endpoints']

export type CommerceApiEndpointName = keyof CommerceApiEndpoints

export type CommerceApiEndpointPayload<endpointName extends CommerceApiEndpointName> =
  CommerceApiEndpoints[endpointName]['Types']['ResultType']

export type SetCommerceApiEndpointCachePayload<endpointName extends CommerceApiEndpointName> = {
  endpointName: endpointName
  cacheKey: string
  payload: CommerceApiEndpointPayload<endpointName>
}

export type RemoveCommerceApiEndpointCachePayload<endpointName extends CommerceApiEndpointName> = {
  endpointName: endpointName
  cacheKey: string
}
