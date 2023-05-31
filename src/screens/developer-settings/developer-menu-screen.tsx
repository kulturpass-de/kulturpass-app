import React, { useCallback, useState } from 'react'
import { StyleSheet, Switch, TextInput, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { ListItem } from '../../components/list-item/list-item'
import { Icon } from '../../components/icon/icon'
import { RootState } from '../../services/redux/configure-store'
import { setShowOnboardingOnStartup } from '../../features/onboarding/redux/onboarding'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { spacing } from '../../theme/spacing'
import { useTranslation } from '../../services/translation/translation'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { Button } from '../../components/button/button'
import { useModalNavigation } from '../../navigation/modal/hooks'
import { ProductDetailRouteConfig } from '../../features/product-detail/screens/product-detail-route'
import { colors } from '../../theme/colors'
import { getIsUserLoggedIn } from '../../services/auth/store/auth-selectors'
import { ScreenContent } from '../../components/screen/screen-content'
import { AA2CommandService } from '@sap/react-native-ausweisapp2-wrapper'

export type DeveloperMenuScreenProps = {
  onHeaderPressClose: () => void
  onPressEnvironmentConfiguration: () => void
  onPressAppConfig: () => void
  onPressCardSimulationConfiguration: () => void
  onPressStorybookConfiguration: () => void
}

const useOnboardingConfig = () => {
  const showOnboardingOnAppStart = useSelector((state: RootState) => state.persisted.onboarding.showOnboardingOnStartup)
  const dispatch = useDispatch()

  const toggleShowOnboardingOnAppStart = useCallback(() => {
    dispatch(setShowOnboardingOnStartup(!showOnboardingOnAppStart))
  }, [dispatch, showOnboardingOnAppStart])

  return { showOnboardingOnAppStart, toggleShowOnboardingOnAppStart }
}

export const DeveloperMenuScreen: React.FC<DeveloperMenuScreenProps> = ({
  onHeaderPressClose,
  onPressEnvironmentConfiguration,
  onPressAppConfig,
  onPressCardSimulationConfiguration,
  onPressStorybookConfiguration,
}) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()
  const modalNavigation = useModalNavigation()
  const isLoggedIn = useSelector(getIsUserLoggedIn)

  const [productCode, setProductCode] = useState('')

  const onOpenProductDetail = useCallback(() => {
    modalNavigation.navigate({
      screen: ProductDetailRouteConfig.name,
      params: {
        productCode: productCode,
        randomMode: false,
      },
    })
  }, [productCode, modalNavigation])

  const cancelEidFlow = useCallback(async () => {
    try {
      await AA2CommandService.cancel()
    } catch (e) {
      console.log(`Could not cancel AA2 Flow: ${e}`)
    }
  }, [])

  const startEidFlow = useCallback(() => {
    modalNavigation.navigate({ screen: 'EidAboutVerification' })
  }, [modalNavigation])

  const { showOnboardingOnAppStart, toggleShowOnboardingOnAppStart } = useOnboardingConfig()

  return (
    <ModalScreen testID={buildTestId('developerMenu')}>
      <ModalScreenHeader
        titleI18nKey="developerMenu_headline_title"
        testID={buildTestId('developerMenu_headline_title')}
        onPressClose={onHeaderPressClose}
      />
      <ScreenContent>
        <ListItem
          icon={<Icon source="Cog" width={29} height={24} />}
          title="Environment Configuration"
          testID={buildTestId('developerMenu_environmentConfiguration_button')}
          type="navigation"
          onPress={onPressEnvironmentConfiguration}
        />
        <ListItem
          icon={<Icon source="Cog" width={29} height={24} />}
          title="App Config"
          testID={buildTestId('developerMenu_appConfig_button')}
          type="navigation"
          onPress={onPressAppConfig}
        />
        <ListItem
          title="Show Storybook"
          testID={buildTestId('developerMenu_storybook_button')}
          type="navigation"
          onPress={onPressStorybookConfiguration}
        />
        <View style={styles.toggleListItem}>
          <TranslatedText
            i18nKey="developerMenu_showOnboarding_label"
            testID={buildTestId('developerMenu_showOnboarding_label')}
            textStyle="BodyRegular"
            textStyleOverrides={styles.textColor}
          />
          <Switch
            testID={buildTestId('developerMenu_showOnboarding_switch')}
            accessibilityLabel={t('developerMenu_showOnboarding_label')}
            value={showOnboardingOnAppStart}
            onValueChange={toggleShowOnboardingOnAppStart}
          />
        </View>
        <View style={styles.productCodeListItem}>
          <TextInput
            autoCorrect={false}
            autoCapitalize="none"
            style={styles.productCodeTextInput}
            onChangeText={setProductCode}
            value={productCode}
          />
          <Button
            onPress={onOpenProductDetail}
            testID="developerMenu_showProductDetail_button"
            i18nKey="developerMenu_showProductDetail_button"
          />
        </View>
        <ListItem
          icon={<Icon source="Cog" width={29} height={24} />}
          title="Card Simulation"
          testID={buildTestId('developerMenu_cardSimulation_button')}
          type="navigation"
          onPress={onPressCardSimulationConfiguration}
        />
        {isLoggedIn ? (
          <View style={styles.productCodeListItem}>
            <Button
              onPress={startEidFlow}
              testID="developerMenu_startEidFlow_button"
              i18nKey="developerMenu_startEidFlow_button"
            />
          </View>
        ) : null}
        <View style={styles.productCodeListItem}>
          <Button
            onPress={cancelEidFlow}
            testID="developerMenu_cancelEidFlow_button"
            i18nKey="developerMenu_cancelEidFlow_button"
          />
        </View>
      </ScreenContent>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  toggleListItem: {
    paddingHorizontal: spacing[6],
    height: spacing[10],
    borderBottomWidth: 2,
    borderBottomColor: colors.basicBlack,
    backgroundColor: colors.basicWhite,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productCodeListItem: {
    flexDirection: 'column',
    paddingHorizontal: spacing[6],
    borderBottomWidth: 2,
    borderBottomColor: colors.basicBlack,
    backgroundColor: colors.basicWhite,
    paddingVertical: 12,
  },
  productCodeTextInput: {
    height: 48,
    paddingHorizontal: spacing[6],
    marginBottom: 12,
    backgroundColor: colors.basicWhite,
    borderWidth: 2,
    borderColor: colors.basicBlack,
    borderRadius: 8,
  },
  textColor: {
    color: colors.moonDarkest,
  },
})
