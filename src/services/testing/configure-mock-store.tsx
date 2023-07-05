import { AnyAction, configureStore, isPlain, Middleware, ThunkAction } from '@reduxjs/toolkit'
import React from 'react'
import { Provider } from 'react-redux'
import { cdcApi } from '../api/cdc-api'
import { commerceApi } from '../api/commerce-api'
import { ErrorWithCode } from '../errors/errors'
import { RootState } from '../redux/configure-store'
import { listenerMiddleware } from '../redux/listener-middleware'
import { reduxPersistIgnoredActions } from '../redux/persist-reducer'
import { rootReducer } from '../redux/root-reducer'
import { expectObjectContainingEqual } from './expect-object-containing-equal'

export const configureMockStore = (params?: { middlewares?: Middleware[]; preloadedState?: RootState }) => {
  const defaultMiddlewares = [cdcApi.middleware, commerceApi.middleware, listenerMiddleware.middleware]
  const middlewares = params?.middlewares || defaultMiddlewares

  const mockStore = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: reduxPersistIgnoredActions,
          isSerializable: (value: unknown) => {
            if (value instanceof ErrorWithCode) {
              return true
            }
            return isPlain(value)
          },
        },
      }).concat(middlewares),
    preloadedState: params?.preloadedState,
  })

  const actions: AnyAction[] = []
  const dispatch = mockStore.dispatch
  mockStore.dispatch = (action: AnyAction | ThunkAction<any, any, any, any>) => {
    if (typeof action !== 'function') {
      actions.push(action)
      return dispatch(action)
    } else {
      return action(mockStore.dispatch, mockStore.getState, undefined)
    }
  }

  const getActions = () => actions

  const clearActions = () => actions.splice(0, actions.length)

  /**
   * This method does a deep comparison for the given actions, but does not ensure the order of execution
   */
  const expectActions = (expectedActions: AnyAction[]) => {
    expectedActions.forEach(expectedAction => {
      expect(actions).toContainEqual(expectObjectContainingEqual(expectedAction))
    })
  }

  const expectActionNotDispatched = (actionMatcher: (action: AnyAction) => boolean) => {
    const actionFound = actions.find(actionMatcher)
    expect(actionFound).toBeFalsy()
  }

  const findAction = <CurrentAction extends AnyAction>(
    actionMatcher: (action: AnyAction) => action is CurrentAction,
  ) => {
    return actions.find(actionMatcher)
  }

  const wrapper: React.FC<React.PropsWithChildren> = ({ children }) => <Provider store={mockStore}>{children}</Provider>

  return { ...mockStore, getActions, clearActions, expectActions, expectActionNotDispatched, findAction, wrapper }
}

export const mockedLoggedInAuthState = {
  auth: {
    cdc: {
      idToken: 'my_id_token',
      isVerified: true,
      sessionSecret: 'my_session_secret',
      sessionStartTimestamp: Date.now(),
      sessionToken: 'my_session_token',
      sessionValidity: -2,
      uid: 'my_uid',
      uidSignature: 'my_uid_signature',
      user: { email: 'my@email.com', firstName: 'my_first_anem' },
    },
    commerce: {
      access_token: 'my_access_token',
      expires_in: 60,
      scope: 'my_scope',
      token_type: 'my_token_type',
      token_valid_until: Date.now() + 60 * 1000,
    },
  },
} as RootState
