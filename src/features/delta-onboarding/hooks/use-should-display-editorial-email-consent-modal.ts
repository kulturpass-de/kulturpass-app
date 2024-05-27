import { useSelector } from 'react-redux'
import { getCdcSessionData, isUserPending } from '../../../services/auth/store/auth-selectors'
import { useUserInfo } from '../../../services/user/use-user-info'
import {
  getShowEditorialEmailModalOnStartup,
  getUserDismissedEditorialEmailModal,
} from '../redux/delta-onboarding-selectors'

export const useShouldDisplayEditorialEmailConsentModal = () => {
  const showEditorialEmailModalOnStartup = useSelector(getShowEditorialEmailModalOnStartup)
  const userDismissedEditorialEmailModal = useSelector(getUserDismissedEditorialEmailModal)

  const { accountInfo } = useUserInfo()

  const isVerified = accountInfo?.data?.isVerified
  const subscribed = accountInfo?.data?.subscriptions?.editorialInformation?.email?.isSubscribed

  const sessionData = useSelector(getCdcSessionData)
  const isVerificationPending = isUserPending(sessionData)

  // under no circumstance display the alert, since we need a login for the cdc api call
  if (!isVerified) {
    return false
  }

  return (
    showEditorialEmailModalOnStartup || // modal has been toggled
    (!showEditorialEmailModalOnStartup &&
      !userDismissedEditorialEmailModal && // user did not just dismiss the modal
      !isVerificationPending && // user did not just verify (needs to re-login)
      isVerified === true && // email verified
      subscribed === undefined) // no consent to editorial email yet
  )
}
