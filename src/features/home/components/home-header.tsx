import React from 'react'
import { useSelector } from 'react-redux'
import { Profile } from '../../../services/api/types/commerce/commerce-get-profile'
import { getAccountVerificationStatus, getIsUserLoggedIn } from '../../../services/auth/store/auth-selectors'
import { EidIdentifyButton } from '../../eid-verification/components/eid-identify-button'
import { NotYetEntitledHeader } from '../../eid-verification/components/not-yet-entitled-header'
import { VerificationDuplicateHeader } from '../../eid-verification/components/verification-duplicate-header'
import { AccountVerificationHero } from '../../registration/components/account-verificaton-pending/account-verification-pending-hero'
import { RegisterNowButton } from '../../registration/components/register-now-button/register-now-button'
import { HomeBudget } from './home-budget'

export type HomeHeaderProps = {
  profile?: Profile
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ profile }) => {
  const isLoggedIn = useSelector(getIsUserLoggedIn)
  const isAccountPendingVerification = useSelector(getAccountVerificationStatus)

  if (!isLoggedIn) {
    return <RegisterNowButton />
  }

  if (isAccountPendingVerification === 'pending') {
    return <AccountVerificationHero />
  }

  if (profile === undefined) {
    return null
  }

  const { identificationStatus, balanceStatus } = profile

  if (identificationStatus === 'DUPLICATE') {
    return <VerificationDuplicateHeader />
  }

  if (identificationStatus === 'NOT_VERIFIED') {
    return <EidIdentifyButton />
  }

  if (identificationStatus === 'VERIFIED' && balanceStatus === 'NOT_YET_ENTITLED') {
    return <NotYetEntitledHeader />
  }

  if (identificationStatus === 'VERIFIED' && balanceStatus === 'ENTITLED') {
    return <HomeBudget balance={profile.balance} />
  }

  return null
}
