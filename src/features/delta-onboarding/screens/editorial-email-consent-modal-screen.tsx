import React from 'react'
import { Button } from '../../../components/button/button'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { EditorialEmailConsentView, EditorialEmailContentViewProps } from '../components/editorial-email-consent-view'

type EditorialEmailConsentModalScreenProps = EditorialEmailContentViewProps & {
  screenKey: string
  onAccept: () => void
  onDecline: () => void
}

export const EditorialEmailConsentModalScreen: React.FC<EditorialEmailConsentModalScreenProps> = props => {
  const { screenKey, onAccept, onDecline } = props

  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const screenTestID = buildTestId(screenKey)

  return (
    <ModalScreen whiteBottom testID={screenTestID}>
      <ModalScreenHeader
        testID={addTestIdModifier(screenTestID, 'header')}
        titleI18nKey={'editorial_email_consent_modal_title'}
      />

      <EditorialEmailConsentView />

      <ModalScreenFooter>
        <Button
          onPress={onAccept}
          variant="primary"
          testID={addTestIdModifier(screenTestID, 'accept_button')}
          i18nKey={'editorial_email_accept'}
        />

        <Button
          onPress={onDecline}
          variant="primary"
          testID={addTestIdModifier(screenTestID, 'decline_button')}
          i18nKey={'editorial_email_decline'}
        />
      </ModalScreenFooter>
    </ModalScreen>
  )
}
