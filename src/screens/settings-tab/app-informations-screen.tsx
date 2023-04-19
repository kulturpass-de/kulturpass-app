import React from 'react'

import { Screen } from '../../components/screen/screen'
import { ScreenHeader } from '../../components/screen/screen-header'
import { useTranslation } from '../../services/translation/translation'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { TranslatedText } from '../../components/translated-text/translated-text'
import pkg from '../../../package.json'
import { StyleSheet } from 'react-native'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

export type AppInformationsScreenProps = {
  onPressBackButton?: () => void
}

export const AppInformationsScreen: React.FC<AppInformationsScreenProps> = ({ onPressBackButton }) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()

  return (
    <Screen
      testID={buildTestId('app_informations')}
      header={
        <ScreenHeader
          testID={buildTestId('app_informations_screen_title')}
          title={t('app_informations_title')}
          onPressBack={onPressBackButton}
        />
      }>
      <TranslatedText
        testID={buildTestId('app_informations_version_text')}
        textStyle="BodyRegular"
        textStyleOverrides={styles.appVersionText}
        i18nKey="app_informations_app_version"
        i18nParams={{ version: pkg.version }}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  appVersionText: {
    textAlign: 'center',
    padding: spacing[5],
    color: colors.primaryDark,
  },
})
