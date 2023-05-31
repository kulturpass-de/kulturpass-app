import React from 'react'
import { useSelector } from 'react-redux'

import { getAccountVerificationStatus, getIsUserLoggedIn } from '../../services/auth/store/auth-selectors'
import { EidIdentifyButton } from '../../features/eid-verification/components/eid-identify-button'
import { HomeBudget } from '../../components/home-budget/home-budget'
import { AccountVerificationHero } from '../../features/registration/components/account-verificaton-pending/account-verification-pending-hero'
import { NotYetEntitledHeader } from '../../features/eid-verification/components/not-yet-entitled-header'
import { VerificationDuplicateHeader } from '../../features/eid-verification/components/verification-duplicate-header'
import { Profile } from '../../services/api/types/commerce/commerce-get-profile'
import { RegisterNowButton } from '../../features/registration/components/register-now-button/register-now-button'

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
