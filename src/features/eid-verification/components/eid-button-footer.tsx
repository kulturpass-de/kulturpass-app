import React from 'react'
import { Button } from '../../../components/button/button'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'

export type EidButtonFooterProps = {
  onNext: () => void
  nextDisabled: boolean
  onCancel: () => void
}

export const EidButtonFooter: React.FC<EidButtonFooterProps> = ({ onNext, nextDisabled, onCancel }) => {
  const { buildTestId } = useTestIdBuilder()

  return (
    <ModalScreenFooter>
      <Button
        onPress={onNext}
        variant="primary"
        disabled={nextDisabled}
        testID={buildTestId('eid_next_button')}
        i18nKey="eid_next_button"
      />
      <Button
        onPress={onCancel}
        variant="white"
        testID={buildTestId('eid_cancel_button')}
        i18nKey="eid_cancel_button"
      />
    </ModalScreenFooter>
  )
}
