import React from 'react'
import { Button } from '../../components/button/button'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../components/modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { ReleaseNotesProps, ReleaseNotesView } from '../../features/release-notes/components/release-notes-view'
import { useTestIdBuilder } from '../../services/test-id/test-id'

type ReleaseNotesModalScreenProps = ReleaseNotesProps

export const ReleaseNotesModalScreen: React.FC<ReleaseNotesModalScreenProps> = ({
  testID,
  headerTitleI18nKey,
  acceptButtonI18nKey,
  onPressOk,
  ...sharedProps
}) => {
  const { buildTestId } = useTestIdBuilder()

  const screenTestID = buildTestId(testID)

  return (
    <ModalScreen whiteBottom testID={screenTestID}>
      <ModalScreenHeader
        testID={buildTestId(headerTitleI18nKey)}
        titleI18nKey={headerTitleI18nKey}
        onPressClose={onPressOk}
      />
      <ReleaseNotesView {...sharedProps} />
      <ModalScreenFooter>
        <Button
          onPress={onPressOk}
          variant="primary"
          testID={buildTestId(acceptButtonI18nKey)}
          i18nKey={acceptButtonI18nKey}
        />
      </ModalScreenFooter>
    </ModalScreen>
  )
}
