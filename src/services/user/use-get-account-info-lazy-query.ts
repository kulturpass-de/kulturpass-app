import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../redux/configure-store'
import { getAccountInfo } from './redux/thunks/get-account-info'

export const useGetAccountInfoLazyQuery = () => {
  const dispatch = useDispatch<AppDispatch>()

  const getAccountInfoLazyQuery = useCallback(
    (currentRegToken?: string) => {
      return dispatch(getAccountInfo({ regToken: currentRegToken })).unwrap()
    },
    [dispatch],
  )

  return getAccountInfoLazyQuery
}
