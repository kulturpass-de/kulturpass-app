import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button } from '../../components/button/button'
import { Illustration } from '../../components/illustration/illustration'

import { Screen } from '../../components/screen/screen'
import { ScreenContent } from '../../components/screen/screen-content'
import { ScreenHeader } from '../../components/screen/screen-header'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { colors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'

export type FavoritesUnauthorizedScreenProps = {
  onSignInRequested: () => void
}

export const FavoritesUnauthorizedScreen: React.FC<FavoritesUnauthorizedScreenProps> = ({ onSignInRequested }) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()

  return (
    <Screen
      testID={buildTestId('favorites_unauthorized')}
      header={
        <ScreenHeader
          testID={buildTestId('favorites_unauthorized_headline')}
          title={t('favorites_headline')}
          borderBottom
        />
      }>
      <ScreenContent style={styles.content}>
        <Illustration
          testID={buildTestId('favorites_empty_hero_image')}
          i18nKey="favorites_empty_hero_image_alt"
          type="favorites-empty-state"
        />
        <TranslatedText
          textStyle="HeadlineH4Extrabold"
          textStyleOverrides={styles.title}
          i18nKey="favorites_unauthorized_no_favorites_title"
          testID={buildTestId('favorites_unauthorized_no_favorites_title')}
        />
        <TranslatedText
          textStyle="BodyRegular"
          textStyleOverrides={styles.hint}
          i18nKey="favorites_unauthorized_no_favorites_hint"
          testID={buildTestId('favorites_unauthorized_no_favorites_hint')}
        />
        <View style={styles.buttonContainer}>
          <Button
            onPress={onSignInRequested}
            testID={buildTestId('favorites_unauthorized_sign_in')}
            i18nKey="login_button"
            widthOption="content"
          />
        </View>
      </ScreenContent>
    </Screen>
  )
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
  },
  title: {
    marginTop: spacing[2],
    paddingHorizontal: 20,
    textAlign: 'center',
    color: colors.basicBlack,
  },
  hint: {
    marginTop: spacing[2],
    paddingHorizontal: 20,
    textAlign: 'center',
    color: colors.primaryDark,
  },
  buttonContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
})
