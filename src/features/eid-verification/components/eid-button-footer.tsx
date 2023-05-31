import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button } from '../../../components/button/button'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { spacing } from '../../../theme/spacing'
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
      <View style={styles.buttonPadding}>
        <Button
          onPress={onNext}
          variant="primary"
          disabled={nextDisabled}
          testID={buildTestId('eid_next_button')}
          i18nKey="eid_next_button"
        />
      </View>
      <Button
        onPress={onCancel}
        variant="white"
        testID={buildTestId('eid_cancel_button')}
        i18nKey="eid_cancel_button"
      />
    </ModalScreenFooter>
  )
}

const styles = StyleSheet.create({
  buttonPadding: {
    paddingBottom: spacing[5],
  },
})
