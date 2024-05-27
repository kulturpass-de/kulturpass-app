import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Screen } from '../../../components/screen/screen'
import { ScreenContent } from '../../../components/screen/screen-content'
import { ScreenHeader } from '../../../components/screen/screen-header'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { EditorialEmailConsentView, EditorialEmailContentViewProps } from '../components/editorial-email-consent-view'

type EditorialEmailConsentScreenProps = EditorialEmailContentViewProps & {
  screenKey: string
  goBack: () => void
}

export const EditorialEmailConsentScreen: React.FC<EditorialEmailConsentScreenProps> = props => {
  const { screenKey, goBack } = props
  const { t } = useTranslation()

  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const screenTestID = buildTestId(screenKey)

  return (
    <Screen
      testID={screenTestID}
      header={
        <ScreenHeader
          testID={addTestIdModifier(screenTestID, 'header')}
          title={t('editorial_email_consent_modal_title')}
          onPressBack={goBack}
          screenType="subscreen"
        />
      }>
      <ScreenContent>
        <View style={styles.container}>
          <EditorialEmailConsentView />
        </View>
      </ScreenContent>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
