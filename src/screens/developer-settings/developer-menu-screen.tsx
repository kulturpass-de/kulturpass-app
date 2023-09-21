import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { AA2CommandService } from '@sap/react-native-ausweisapp2-wrapper'
import React, { useCallback, useReducer, useState } from 'react'
import { Keyboard, Pressable, StyleSheet, Switch, TextInput, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../../components/button/button'
import { ListItem } from '../../components/list-item/list-item'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { ScreenContent } from '../../components/screen/screen-content'
import { SvgImage } from '../../components/svg-image/svg-image'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { setLastShownTimestamp } from '../../features/in-app-review/redux/in-app-review'
import { getLastShownTimestamp } from '../../features/in-app-review/redux/in-app-review-selectors'
import { setShowOnboardingOnStartup } from '../../features/onboarding/redux/onboarding'
import { ProductDetailRouteConfig } from '../../features/product-detail/screens/product-detail-route'
import { useReleaseNotesConfig } from '../../features/release-notes/hooks/use-release-notes-config'
import { RootStackParams } from '../../navigation/types'
import { getIsUserLoggedIn } from '../../services/auth/store/auth-selectors'
import { logger } from '../../services/logger'
import { AppDispatch, RootState } from '../../services/redux/configure-store'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'

export type DeveloperMenuScreenProps = {
  onHeaderPressClose: () => void
  onPressEnvironmentConfiguration: () => void
  onPressAppConfig: () => void
  onPressCardSimulationConfiguration: () => void
  onPressStorybookConfiguration: () => void
  onPressDarkThemeConfiguration: () => void
}

const useOnboardingConfig = () => {
  const showOnboardingOnAppStart = useSelector((state: RootState) => state.persisted.onboarding.showOnboardingOnStartup)
  const dispatch = useDispatch()

  const toggleShowOnboardingOnAppStart = useCallback(() => {
    dispatch(setShowOnboardingOnStartup(!showOnboardingOnAppStart))
  }, [dispatch, showOnboardingOnAppStart])

  return { showOnboardingOnAppStart, toggleShowOnboardingOnAppStart }
}

const CogIcon = () => <SvgImage type="cog" width={29} height={24} />

const ADDITIONAL_OPTIONS_TAP_COUNTER = 3

export const DeveloperMenuScreen: React.FC<DeveloperMenuScreenProps> = ({
  onHeaderPressClose,
  onPressEnvironmentConfiguration,
  onPressAppConfig,
  onPressCardSimulationConfiguration,
  onPressStorybookConfiguration,
  onPressDarkThemeConfiguration,
}) => {
  const { colors } = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const { buildTestId } = useTestIdBuilder()
  const navigation = useNavigation<StackNavigationProp<RootStackParams, 'Tabs'>>()
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams>>()

  const isLoggedIn = useSelector(getIsUserLoggedIn)
  const lastShownTimestamp = useSelector(getLastShownTimestamp)

  const [productCode, setProductCode] = useState('')
  const [tapCounter, incrementTapCounter] = useReducer((current: number) => current + 1, 1)

  const onOpenProductDetail = useCallback(() => {
    // Otherwise the Keyboard might still be open, creating visual bugs through the KeyboardAvoidingView
    Keyboard.dismiss()
    rootNavigation.navigate('PDP', {
      screen: ProductDetailRouteConfig.name,
      params: {
        productCode: productCode,
        randomMode: false,
      },
    })
  }, [productCode, rootNavigation])

  const cancelEidFlow = useCallback(async () => {
    try {
      await AA2CommandService.cancel()
    } catch (e) {
      logger.log(`Could not cancel AA2 Flow: ${e}`)
    }
  }, [])

  const startEidFlow = useCallback(() => {
    navigation.navigate('Eid', { screen: 'EidAboutVerification' })
  }, [navigation])

  const resetInAppReviewTimestamp = useCallback(() => {
    dispatch(setLastShownTimestamp(undefined))
  }, [dispatch])

  const { showOnboardingOnAppStart, toggleShowOnboardingOnAppStart } = useOnboardingConfig()
  const { showReleaseNotesOnAppStart, toggleShowReleaseNotesOnAppStart } = useReleaseNotesConfig()

  return (
    <ModalScreen testID={buildTestId('developerMenu')} withoutBottomSafeArea>
      <Pressable onPress={incrementTapCounter} testID={buildTestId('developerMenu_headline_tapCounterButton')}>
        <ModalScreenHeader
          titleI18nKey="developerMenu_headline_title"
          testID={buildTestId('developerMenu_headline_title')}
          onPressClose={onHeaderPressClose}
        />
      </Pressable>
      <ScreenContent>
        <ListItem
          icon={<CogIcon />}
          title="Environment Configuration"
          testID={buildTestId('developerMenu_environmentConfiguration_button')}
          type="navigation"
          onPress={onPressEnvironmentConfiguration}
        />
        <ListItem
          icon={<CogIcon />}
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
        <View
          style={[
            styles.toggleListItem,
            { borderBottomColor: colors.listItemBorder, backgroundColor: colors.secondaryBackground },
          ]}>
          <TranslatedText
            i18nKey="developerMenu_showOnboarding_label"
            testID={buildTestId('developerMenu_showOnboarding_label')}
            textStyle="BodyRegular"
            textStyleOverrides={{ color: colors.labelColor }}
          />
          <Switch
            testID={buildTestId('developerMenu_showOnboarding_switch')}
            accessibilityLabel={t('developerMenu_showOnboarding_label')}
            value={showOnboardingOnAppStart}
            onValueChange={toggleShowOnboardingOnAppStart}
          />
        </View>
        <View
          style={[
            styles.toggleListItem,
            { borderBottomColor: colors.listItemBorder, backgroundColor: colors.secondaryBackground },
          ]}>
          <TranslatedText
            i18nKey="developerMenu_showReleaseNotes_label"
            testID={buildTestId('developerMenu_showReleaseNotes_label')}
            textStyle="BodyRegular"
            textStyleOverrides={{ color: colors.labelColor }}
          />
          <Switch
            testID={buildTestId('developerMenu_showReleaseNotes_switch')}
            accessibilityLabel={t('developerMenu_showReleaseNotes_label')}
            value={showReleaseNotesOnAppStart}
            onValueChange={toggleShowReleaseNotesOnAppStart}
          />
        </View>
        {tapCounter > ADDITIONAL_OPTIONS_TAP_COUNTER ? (
          <ListItem
            title="Dark Theme Preview"
            testID={buildTestId('developerMenu_darkTheme_button')}
            type="navigation"
            onPress={onPressDarkThemeConfiguration}
          />
        ) : null}
        <View
          style={[
            styles.productCodeListItem,
            { borderBottomColor: colors.listItemBorder, backgroundColor: colors.secondaryBackground },
          ]}>
          <TextInput
            autoCorrect={false}
            autoCapitalize="none"
            style={[
              styles.productCodeTextInput,
              {
                borderColor: colors.listItemBorder,
                backgroundColor: colors.secondaryBackground,
                color: colors.labelColor,
              },
            ]}
            onChangeText={setProductCode}
            value={productCode}
          />
          <Button
            onPress={onOpenProductDetail}
            testID={buildTestId('developerMenu_showProductDetail_button')}
            i18nKey="developerMenu_showProductDetail_button"
          />
        </View>
        <ListItem
          icon={<CogIcon />}
          title="Card Simulation"
          testID={buildTestId('developerMenu_cardSimulation_button')}
          type="navigation"
          onPress={onPressCardSimulationConfiguration}
        />
        <View
          style={[
            styles.productCodeListItem,
            { borderBottomColor: colors.listItemBorder, backgroundColor: colors.secondaryBackground },
          ]}>
          <Button
            disabled={lastShownTimestamp === undefined}
            onPress={resetInAppReviewTimestamp}
            testID={buildTestId('developerMenu_resetInAppReviewTimestamp_button')}
            i18nKey="developerMenu_resetInAppReviewTimestamp_button"
          />
          <TranslatedText
            textStyle="BodyRegular"
            i18nKey="developerMenu_resetInAppReviewTimestamp_message"
            textStyleOverrides={[styles.warningMessage, { color: colors.labelColor }]}
          />
        </View>
        {isLoggedIn && tapCounter > ADDITIONAL_OPTIONS_TAP_COUNTER ? (
          <View
            style={[
              styles.productCodeListItem,
              { borderBottomColor: colors.listItemBorder, backgroundColor: colors.secondaryBackground },
            ]}>
            <Button
              onPress={startEidFlow}
              testID={buildTestId('developerMenu_startEidFlow_button')}
              i18nKey="developerMenu_startEidFlow_button"
            />
          </View>
        ) : null}
        {tapCounter > ADDITIONAL_OPTIONS_TAP_COUNTER ? (
          <View
            style={[
              styles.productCodeListItem,
              { borderBottomColor: colors.listItemBorder, backgroundColor: colors.secondaryBackground },
            ]}>
            <Button
              onPress={cancelEidFlow}
              testID={buildTestId('developerMenu_cancelEidFlow_button')}
              i18nKey="developerMenu_cancelEidFlow_button"
            />
          </View>
        ) : null}
      </ScreenContent>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  toggleListItem: {
    paddingHorizontal: spacing[6],
    height: spacing[10],
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productCodeListItem: {
    flexDirection: 'column',
    paddingHorizontal: spacing[6],
    borderBottomWidth: 2,
    paddingVertical: 12,
  },
  productCodeTextInput: {
    height: 48,
    paddingHorizontal: spacing[6],
    marginBottom: 12,
    borderWidth: 2,
    borderRadius: 8,
  },
  warningMessage: {
    textAlign: 'center',
    paddingTop: spacing[1],
  },
})
