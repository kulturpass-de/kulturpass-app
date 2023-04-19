import React from 'react'

import { Screen } from '../../components/screen/screen'
import { ScreenHeader } from '../../components/screen/screen-header'
import { useTranslation } from '../../services/translation/translation'
import { Language } from '../../services/translation/types'
import { ListItem } from '../../components/list-item/list-item'
import { Icon } from '../../components/icon/icon'
import { StyleSheet } from 'react-native'
import { useTestIdBuilder } from '../../services/test-id/test-id'

/* eslint-disable react/jsx-no-bind */

export type ChangeLanguageScreenProps = {
  onHeaderPressClose: () => void
}

export const ChangeLanguageScreen: React.FC<ChangeLanguageScreenProps> = ({ onHeaderPressClose }) => {
  const { t, l, cl, languages } = useTranslation()
  const { buildTestId } = useTestIdBuilder()

  const availableLanguages = languages().languages

  const onLanguageSelection = (newLanguage: Language) => {
    cl(newLanguage)
  }

  return (
    <Screen
      testID={buildTestId('changeLanguage')}
      header={
        <ScreenHeader
          testID={buildTestId('changeLanguage_title')}
          title={t('changeLanguage_title')}
          onPressBack={onHeaderPressClose}
        />
      }>
      {availableLanguages.map(language => (
        <ListItem
          key={language}
          icon={
            <Icon
              source="Chevron"
              width={24}
              height={24}
              style={l === language ? styles.selectedLanguage : styles.unselectedLanguage}
            />
          }
          title={t(`language_${language}`)}
          testID={buildTestId(`changeLanguage_${language}_button`)}
          onPress={() => onLanguageSelection(language)}
        />
      ))}
    </Screen>
  )
}

const styles = StyleSheet.create({
  selectedLanguage: {
    opacity: 1,
  },
  unselectedLanguage: {
    opacity: 0,
  },
})
