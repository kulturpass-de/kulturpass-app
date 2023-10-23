import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './services/redux/store'

export const AppHeadless = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} />
    </Provider>
  )
}
