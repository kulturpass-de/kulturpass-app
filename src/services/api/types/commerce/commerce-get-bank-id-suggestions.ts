export type BankIdSuggestion = {
  code: string
  name: string
}

export type BankIdSuggestionsParams = {
  query: string
}

export type BankIdSuggestionsResponse = {
  results: Array<BankIdSuggestion>
}
