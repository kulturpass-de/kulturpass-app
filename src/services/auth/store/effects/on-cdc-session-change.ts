import { AppStartListening, ListenerEffect, ListenerPredicate } from '../../../redux/listener-middleware'
import { getIsUserLoggedInToCdc } from '../auth-selectors'
import { authCommerceLogin } from '../thunks/auth-commerce-login'

export const onCdcSessionChangePredicate: ListenerPredicate = (action, currentState, previousState) => {
  const didCdcIdTokenChange: boolean =
    !!previousState.auth.cdc?.idToken &&
    !!currentState.auth.cdc?.idToken &&
    previousState.auth.cdc?.idToken !== currentState.auth.cdc?.idToken

  const isUserLoggedInToCdc = getIsUserLoggedInToCdc(currentState)

  return isUserLoggedInToCdc && didCdcIdTokenChange
}

export const onCdcSessionChangeEffect: ListenerEffect = async (action, listenerApi) => {
  const state = listenerApi.getState()
  if (state.auth.cdc) {
    await listenerApi.dispatch(authCommerceLogin(state.auth.cdc)).unwrap()
  }
}

export const onCdcSessionChange = (startListening: AppStartListening) =>
  startListening({ predicate: onCdcSessionChangePredicate, effect: onCdcSessionChangeEffect })
