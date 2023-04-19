import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../redux/configure-store'
import { getAuthState } from './store/auth-selectors'
import { authLogin } from './store/thunks/auth-login'
import { authLogout } from './store/thunks/auth-logout'

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>()
  const auth = useSelector(getAuthState)

  const login = async (...params: Parameters<typeof authLogin>) => {
    await dispatch(authLogin(...params)).unwrap()
  }

  const logout = async () => {
    await dispatch(authLogout()).unwrap()
  }

  return { isLoading: auth.isLoading, login, logout }
}
