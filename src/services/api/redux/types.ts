import { commerceApi } from '../commerce-api'

type CommerceApiEndpoints = (typeof commerceApi)['endpoints']

export type CommerceApiEndpointName = keyof CommerceApiEndpoints

export type CommerceApiEndpointCache<endpointName extends CommerceApiEndpointName> = {
  args: CommerceApiEndpoints[endpointName]['Types']['QueryArg']
  payload: CommerceApiEndpoints[endpointName]['Types']['ResultType']
}

export type SetCommerceApiEndpointCachePayload<endpointName extends CommerceApiEndpointName> = {
  endpointName: endpointName
  cache: CommerceApiEndpointCache<endpointName>
}
