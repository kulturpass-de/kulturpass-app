import React, { useMemo } from 'react'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { useTestIdBuilder } from '../../../services/test-id/test-id'

export type StorybookScreenProps = {
  onHeaderPressBack: () => void
  onHeaderPressClose: () => void
}

export const StorybookScreen: React.FC<StorybookScreenProps> = ({ onHeaderPressBack, onHeaderPressClose }) => {
  const { buildTestId } = useTestIdBuilder()
  const StorybookComponent = useMemo(() => {
    return require('../../../../.storybook/Storybook').default
  }, [])

  return (
    <ModalScreen whiteBottom testID={buildTestId('storybook')}>
      <ModalScreenHeader
        testID={buildTestId('storybook_headline_title')}
        titleI18nKey="storybook_headline_title"
        onPressBack={onHeaderPressBack}
        onPressClose={onHeaderPressClose}
      />
      <StorybookComponent />
    </ModalScreen>
  )
}
