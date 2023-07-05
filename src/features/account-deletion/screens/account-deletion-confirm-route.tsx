import React, { useCallback } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { AccountDeletionConfirmScreen } from './account-deletion-confirm-screen'
import { AccountDeletionSuccessfulRouteName } from './account-deletion-successful-route'

export const AccountDeletionConfirmRouteName = 'AccountDeletionConfirm'

export type AccountDeletionConfirmRouteParams = undefined

export const AccountDeletionConfirmRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()

  const onNext = useCallback(() => {
    modalNavigation.navigate({
      screen: AccountDeletionSuccessfulRouteName,
    })
  }, [modalNavigation])

  const onClose = useCallback(() => {
    modalNavigation.closeModal()
  }, [modalNavigation])

  return <AccountDeletionConfirmScreen onClose={onClose} onNext={onNext} />
}

export const AccountDeletionConfirmRouteConfig = createRouteConfig({
  name: AccountDeletionConfirmRouteName,
  component: AccountDeletionConfirmRoute,
  options: { cardStyle: modalCardStyle },
})
