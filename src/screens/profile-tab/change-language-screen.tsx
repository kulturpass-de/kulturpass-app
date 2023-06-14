import React from 'react'
import { useDispatch } from 'react-redux'

import { Screen } from '../../components/screen/screen'
import { ScreenHeader } from '../../components/screen/screen-header'
import { useTranslation } from '../../services/translation/translation'
import { Language } from '../../services/translation/types'
import { ListItem } from '../../components/list-item/list-item'
import { StyleSheet, View } from 'react-native'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { Icon } from '../../components/icon/icon'
import { commerceApi } from '../../services/api/commerce-api'
import { AppDispatch } from '../../services/redux/configure-store'

export type ChangeLanguageScreenProps = {
  onHeaderPressClose: () => void
}

export const ChangeLanguageScreen: React.FC<ChangeLanguageScreenProps> = ({ onHeaderPressClose }) => {
  const { t, l, cl, ls } = useTranslation()
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const dispatch = useDispatch<AppDispatch>()

  const onLanguageSelection = (newLanguage: Language) => () => {
    cl(newLanguage)
    dispatch(commerceApi.util.invalidateTags(['language']))
  }

  const SCREEN_TEST_ID = buildTestId('changeLanguage')

  return (
    <Screen
      testID={SCREEN_TEST_ID}
      header={
        <ScreenHeader
          testID={addTestIdModifier(SCREEN_TEST_ID, 'title')}
          title={t('changeLanguage_title')}
          onPressBack={onHeaderPressClose}
          screenType="subscreen"
        />
      }>
      {ls.map(language => (
        <ListItem
          key={language}
          icon={l === language ? <Icon source="Check" width={24} height={24} /> : <View style={styles.noIcon} />}
          title={t(`language_${language}`)}
          testID={buildTestId(`language_${language}`)}
          onPress={onLanguageSelection(language)}
          accessibilityState={l === language ? { selected: true } : undefined}
        />
      ))}
    </Screen>
  )
}

const styles = StyleSheet.create({
  noIcon: {
    width: 24,
  },
})
