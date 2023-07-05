import React, { useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { Button } from '../../components/button/button'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { ScreenContent } from '../../components/screen/screen-content'
import { commerceApi } from '../../services/api/commerce-api'
import { RootState } from '../../services/redux/configure-store'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

export type AppConfigScreenProps = {
  onHeaderPressBack: () => void
  onHeaderPressClose: () => void
}

export const AppConfigScreen: React.FC<AppConfigScreenProps> = ({ onHeaderPressBack, onHeaderPressClose }) => {
  const { buildTestId } = useTestIdBuilder()

  const currentAppConfig = useSelector((state: RootState) => state.persisted.appCore.appConfig)

  const [executeQuery] = commerceApi.useLazyGetAppConfigQuery()

  const onPressForceReloadAppConfig = useCallback(() => {
    executeQuery(undefined, false)
  }, [executeQuery])

  return (
    <ModalScreen testID={buildTestId('appConfig')}>
      <ModalScreenHeader
        titleI18nKey="appConfig_headline_title"
        testID={buildTestId('appConfig_headline_title')}
        onPressBack={onHeaderPressBack}
        onPressClose={onHeaderPressClose}
      />
      <ScreenContent>
        <View style={styles.buttonListItem}>
          <Button
            onPress={onPressForceReloadAppConfig}
            testID="appConfig_forceReload_button"
            i18nKey="appConfig_forceReload_button"
          />
        </View>
        <Text style={styles.currentAppConfig}>{JSON.stringify(currentAppConfig, null, 4)}</Text>
      </ScreenContent>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  currentAppConfig: {
    margin: spacing[3],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    borderWidth: 1,
    borderColor: colors.moonDarkest,
    borderRadius: 5,
    color: colors.moonDarkest,
  },
  buttonListItem: {
    flexDirection: 'column',
    paddingHorizontal: spacing[6],
    borderBottomWidth: 2,
    borderBottomColor: colors.basicBlack,
    backgroundColor: colors.basicWhite,
    paddingVertical: 12,
  },
})
