import React, { useCallback } from 'react'
import { StyleSheet, Switch, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from '../../components/icon/icon'
import { ListItem } from '../../components/list-item/list-item'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { ScreenContent } from '../../components/screen/screen-content'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { colors } from '../../theme/colors'
import { setDarkThemePreviewEnabled, setForcedTheme } from '../../theme/redux/theme'
import { getDarkThemePreviewEnabled, getForcedTheme } from '../../theme/redux/theme-selectors'
import { spacing } from '../../theme/spacing'

export type DarkModePreviewScreenProps = {
  onHeaderPressBack: () => void
  onHeaderPressClose: () => void
}

export const DarkModePreviewScreen: React.FC<DarkModePreviewScreenProps> = ({
  onHeaderPressBack,
  onHeaderPressClose,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const darkThemePreviewEnabled = useSelector(getDarkThemePreviewEnabled)
  const forcedTheme = useSelector(getForcedTheme)

  const toggleDarkThemePreviewEnabled = useCallback(() => {
    dispatch(setDarkThemePreviewEnabled(!darkThemePreviewEnabled))
  }, [darkThemePreviewEnabled, dispatch])

  const onForcedThemeChange = useCallback(
    (newForcedTheme: 'light' | 'dark' | null) => {
      dispatch(setForcedTheme(newForcedTheme))
    },
    [dispatch],
  )

  return (
    <ModalScreen testID={buildTestId('developerMenu_darkTheme')}>
      <ModalScreenHeader
        titleI18nKey="developerMenu_darkTheme_headline_title"
        testID={buildTestId('developerMenu_darkTheme_headline_title')}
        onPressBack={onHeaderPressBack}
        onPressClose={onHeaderPressClose}
      />
      <View style={styles.toggleListItem}>
        <TranslatedText
          i18nKey="developerMenu_darkTheme_label"
          testID={buildTestId('developerMenu_darkTheme_label')}
          textStyle="BodyRegular"
          textStyleOverrides={styles.text}
        />
        <Switch
          testID={buildTestId('developerMenu_darkTheme_label')}
          accessibilityLabel={t('developerMenu_darkTheme_label')}
          value={darkThemePreviewEnabled}
          onValueChange={toggleDarkThemePreviewEnabled}
        />
      </View>
      {darkThemePreviewEnabled ? (
        <ScreenContent>
          <ListItem
            icon={
              forcedTheme === null ? <Icon source="Chevron" width={24} height={24} /> : <View style={styles.noIcon} />
            }
            title={t('developerMenu_darkTheme_systemSettings_label')}
            testID={buildTestId('developerMenu_darkTheme_systemSettings_button')}
            // eslint-disable-next-line react/jsx-no-bind
            onPress={() => onForcedThemeChange(null)}
          />
          <ListItem
            icon={
              forcedTheme === 'light' ? (
                <Icon source="Chevron" width={24} height={24} />
              ) : (
                <View style={styles.noIcon} />
              )
            }
            title={t('developerMenu_darkTheme_lightTheme_label')}
            testID={buildTestId('developerMenu_darkTheme_lightTheme_button')}
            // eslint-disable-next-line react/jsx-no-bind
            onPress={() => onForcedThemeChange('light')}
          />
          <ListItem
            icon={
              forcedTheme === 'dark' ? <Icon source="Chevron" width={24} height={24} /> : <View style={styles.noIcon} />
            }
            title={t('developerMenu_darkTheme_darkTheme_label')}
            testID={buildTestId('developerMenu_darkTheme_darkTheme_button')}
            // eslint-disable-next-line react/jsx-no-bind
            onPress={() => onForcedThemeChange('dark')}
          />
        </ScreenContent>
      ) : null}
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  noIcon: {
    width: 24,
  },
  text: {
    color: colors.basicBlack,
  },
  toggleListItem: {
    paddingHorizontal: spacing[5],
    height: spacing[10],
    borderBottomWidth: 2,
    borderBottomColor: '#E6E6E6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
