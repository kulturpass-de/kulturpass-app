export type LocationSuggestion = {
  id: string
  name: string
  latitude: number
  longitude: number
}

export type GetLocationSuggestionsParams = {
  query: string
}

export type GetLocationSuggestionsResponse = {
  results: Array<LocationSuggestion>
}
