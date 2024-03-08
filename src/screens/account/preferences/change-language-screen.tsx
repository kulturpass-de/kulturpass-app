import React, { useCallback } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { InfoBox } from '../../../components/info-box/info-box'
import { ListItem } from '../../../components/list-item/list-item'
import { Screen } from '../../../components/screen/screen'
import { ScreenContent } from '../../../components/screen/screen-content'
import { ScreenHeader } from '../../../components/screen/screen-header'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { commerceApi } from '../../../services/api/commerce-api'
import { useFaqLink } from '../../../services/faq-configuration/hooks/use-faq-link'
import { AppDispatch } from '../../../services/redux/configure-store'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { untranslatedTexts } from '../../../services/translation/i18n'
import { useTranslation } from '../../../services/translation/translation'
import { Language } from '../../../services/translation/types'
import { useTextStyles } from '../../../theme/hooks/use-text-styles'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { linkLogger, openLink } from '../../../utils/links/utils'

export type ChangeLanguageScreenProps = {
  onHeaderPressClose: () => void
}

export const ChangeLanguageScreen: React.FC<ChangeLanguageScreenProps> = ({ onHeaderPressClose }) => {
  const { t, l, cl, ls } = useTranslation()
  const { colors } = useTheme()
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const dispatch = useDispatch<AppDispatch>()
  const browserTranslationFaqLink = useFaqLink('BROWSER_TRANSLATION')
  const textStyles = useTextStyles()

  const onBrowserTranslationPress = useCallback(() => {
    openLink(browserTranslationFaqLink).catch(linkLogger)
  }, [browserTranslationFaqLink])

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
      <ScreenContent>
        <View style={styles.container}>
          <View>
            {ls.map(language => (
              <ListItem
                key={language}
                icon={
                  l === language ? <SvgImage type="check" width={24} height={24} /> : <View style={styles.noIcon} />
                }
                title={t(`language_${language}`)}
                testID={buildTestId(`language_${language}`)}
                onPress={onLanguageSelection(language)}
                accessibilityState={l === language ? { selected: true } : undefined}
              />
            ))}
          </View>
          <View style={styles.infoBoxContainer}>
            <Pressable
              onPress={onBrowserTranslationPress}
              accessible
              accessibilityRole="button"
              accessibilityLabel={untranslatedTexts.changeLanguage_browser_translation_title}
              accessibilityHint={untranslatedTexts.changeLanguage_browser_translation_text}>
              <InfoBox
                containerStyle={styles.infoBox}
                testID={buildTestId('changeLanguage_browser_translation_container')}>
                <View style={styles.content}>
                  <SvgImage type="letters" width={24} height={24} />
                  <View style={styles.textContainer}>
                    <Text
                      testID={buildTestId('changeLanguage_browser_translation_title')}
                      style={[textStyles.BodySmallExtrabold, { color: colors.labelColor }]}>
                      {untranslatedTexts.changeLanguage_browser_translation_title}
                    </Text>
                    <Text
                      style={[textStyles.BodySmallSemibold, styles.text, { color: colors.labelColor }]}
                      testID={buildTestId('changeLanguage_browser_translation_text')}>
                      {untranslatedTexts.changeLanguage_browser_translation_text}
                    </Text>
                  </View>
                  <SvgImage style={styles.linkIcon} type="list-link" height={24} width={24} />
                </View>
              </InfoBox>
            </Pressable>
          </View>
        </View>
      </ScreenContent>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing[6],
    gap: spacing[6],
    flexDirection: 'column',
  },
  noIcon: {
    width: 24,
  },
  infoBoxContainer: {
    paddingHorizontal: spacing[5],
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    flexShrink: 1,
    paddingVertical: spacing[2],
  },
  text: {
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  textContainer: {
    flexShrink: 1,
    paddingHorizontal: spacing[4],
  },
  linkIcon: {
    alignSelf: 'center',
  },
})
