import { Action } from '@reduxjs/toolkit'
import { RunSagaOptions, runSaga, Saga } from 'redux-saga'
import { createStore } from 'redux'
import { RootState } from '../redux/configure-store'
import { rootReducer } from '../redux/root-reducer'

// Typed version of:
// https://github.com/philherbert/saga-testing-examples/blob/master/src/testUtils.js

type SagaParameters = object[]

export async function recordSaga(props: { saga: Saga; params?: SagaParameters; state?: RootState }) {
  const { saga, params = [], state } = props
  const dispatched: Action[] = []
  const options: RunSagaOptions<Action, RootState> = {
    dispatch: (action: Action) => dispatched.push(action),
  }

  if (state) {
    // inject state
    options.getState = () => state
  }

  await runSaga<Action, RootState, any>(options, saga, ...params)

  return dispatched
}

export const buildState = (stateObject: Partial<RootState>): RootState => {
  return { ...createStore(rootReducer).getState(), ...stateObject }
}
