import React from 'react'
import { useSelector } from 'react-redux'
import { StyleSheet, View } from 'react-native'

import { getAccountVerificationStatus } from '../../services/auth/store/auth-selectors'
import { EidIdentifyButton } from '../../features/eid-verification/components/eid-identify-button'
import { spacing } from '../../theme/spacing'
import { HomeBudget } from '../../components/home-budget/home-budget'
import { AccountVerificationHero } from '../../features/registration/components/account-verificaton-pending/account-verification-pending-hero'
import { NotYetEntitledHeader } from '../../features/eid-verification/components/not-yet-entitled-header'
import { VerificationDuplicateHeader } from '../../features/eid-verification/components/verification-duplicate-header'
import { Profile } from '../../services/api/types/commerce/commerce-profile'

export type HomeHeaderProps = {
  profile: Profile
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ profile }) => {
  const isAccountPendingVerification = useSelector(getAccountVerificationStatus)

  if (isAccountPendingVerification === 'pending') {
    return (
      <View style={styles.accountVerificationWrapper}>
        <AccountVerificationHero />
      </View>
    )
  }

  const { identificationStatus, balanceStatus } = profile

  if (identificationStatus === 'DUPLICATE') {
    return (
      <View style={styles.buttonContainer}>
        <VerificationDuplicateHeader />
      </View>
    )
  }

  if (identificationStatus === 'NOT_VERIFIED') {
    return (
      <View style={styles.buttonContainer}>
        <EidIdentifyButton />
      </View>
    )
  }

  if (identificationStatus === 'VERIFIED' && balanceStatus === 'NOT_YET_ENTITLED') {
    return (
      <View style={styles.buttonContainer}>
        <NotYetEntitledHeader />
      </View>
    )
  }

  if (identificationStatus === 'VERIFIED' && balanceStatus === 'ENTITLED') {
    return <HomeBudget balance={profile.balance} />
  }

  return null
}

const styles = StyleSheet.create({
  buttonContainer: {
    paddingBottom: spacing[5],
  },
  accountVerificationWrapper: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[5],
  },
})
