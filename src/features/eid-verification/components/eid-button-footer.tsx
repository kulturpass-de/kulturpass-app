import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button } from '../../../components/button/button'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'

export type EidButtonFooterProps = {
  onNext: () => void
  nextDisabled: boolean
  onCancel: () => void
}

export const EidButtonFooter: React.FC<EidButtonFooterProps> = ({ onNext, nextDisabled, onCancel }) => {
  const { buildTestId } = useTestIdBuilder()

  return (
    <View style={styles.buttonFooter}>
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
    </View>
  )
}

const styles = StyleSheet.create({
  buttonFooter: {
    backgroundColor: colors.basicWhite,
    padding: spacing[5],
    borderTopWidth: 2,
    borderTopColor: colors.basicBlack,
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    height: 134,
  },
  buttonPadding: {
    paddingBottom: spacing[5],
  },
})
