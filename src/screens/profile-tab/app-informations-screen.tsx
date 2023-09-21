import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import pkg from '../../../package.json'
import { ListItem } from '../../components/list-item/list-item'
import { Screen } from '../../components/screen/screen'
import { ScreenHeader } from '../../components/screen/screen-header'
import { SvgImage } from '../../components/svg-image/svg-image'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { ReleaseNotesRouteName } from '../../features/release-notes/screens/release-notes-route'
import { SettingsParamList } from '../../navigation/tabs/settings/types'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import {
  useLocalizedEnvironmentUrl,
  getCdcDpsDocumentUrl,
  getCdcEulaDocumentUrl,
  getImprintUrl,
  getOpenSourceLegalNoticeUrl,
} from '../../utils/links/hooks/use-localized-environment-url'
import { linkLogger, openLink } from '../../utils/links/utils'

export type AppInformationsScreenProps = {
  onPressBackButton?: () => void
}

export const AppInformationsScreen: React.FC<AppInformationsScreenProps> = ({ onPressBackButton }) => {
  const { t } = useTranslation()
  const { colors, colorScheme } = useTheme()
  const { buildTestId } = useTestIdBuilder()
  const navigation = useNavigation<StackNavigationProp<SettingsParamList>>()

  const dpsDocumentUrl = useLocalizedEnvironmentUrl(getCdcDpsDocumentUrl)
  const eulaDocumentUrl = useLocalizedEnvironmentUrl(getCdcEulaDocumentUrl)
  const imprintUrl = useLocalizedEnvironmentUrl(getImprintUrl)
  const openSourceLegalNoticeUrl = useLocalizedEnvironmentUrl(getOpenSourceLegalNoticeUrl)

  const onDpsDocumentLinkPress = useCallback(() => openLink(dpsDocumentUrl).catch(linkLogger), [dpsDocumentUrl])
  const onEulaDocumentLinkPress = useCallback(() => openLink(eulaDocumentUrl).catch(linkLogger), [eulaDocumentUrl])
  const onImprintLinkPress = useCallback(() => openLink(imprintUrl).catch(linkLogger), [imprintUrl])
  const onOpenSourceLegalNoticeLinkPress = useCallback(
    () => openLink(openSourceLegalNoticeUrl).catch(linkLogger),
    [openSourceLegalNoticeUrl],
  )
  const onOpenReleaseNotes = useCallback(() => navigation.navigate(ReleaseNotesRouteName), [navigation])

  return (
    <Screen
      testID={buildTestId('app_informations')}
      header={
        <ScreenHeader
          testID={buildTestId('app_informations_title')}
          title={t('app_informations_title')}
          onPressBack={onPressBackButton}
          screenType="subscreen"
        />
      }>
      <ScrollView contentContainerStyle={styles.container}>
        <ListItem
          title={t('app_informations_releaseNotes_link_text')}
          testID={buildTestId('app_informations_releaseNotes_link_text')}
          onPress={onOpenReleaseNotes}
          type="navigation"
        />
        <ListItem
          title={t('app_informations_dataPrivacy_link_text')}
          testID={buildTestId('app_informations_dataPrivacy_link_text')}
          onPress={onDpsDocumentLinkPress}
          type="link"
        />
        <ListItem
          title={t('app_informations_eula_link_text')}
          testID={buildTestId('app_informations_eula_link_text')}
          onPress={onEulaDocumentLinkPress}
          type="link"
        />
        <ListItem
          title={t('app_informations_imprint_link_text')}
          testID={buildTestId('app_informations_imprint_link_text')}
          onPress={onImprintLinkPress}
          type="link"
        />
        <ListItem
          title={t('app_informations_openSourceLegalNotice_link_text')}
          testID={buildTestId('app_informations_openSourceLegalNotice_link_text')}
          onPress={onOpenSourceLegalNoticeLinkPress}
          type="link"
          noBorderBottom
        />
        <View>
          <TranslatedText
            testID={buildTestId('app_informations_version')}
            textStyle="CaptionSemibold"
            textStyleOverrides={[styles.appVersionText, { color: colors.labelColor }]}
            i18nKey="app_informations_app_version"
            i18nParams={{ version: `${pkg.version} (${pkg.buildNumber})` }}
          />
        </View>
        <View style={styles.spacer} />
        {colorScheme === 'light' ? (
          <View style={styles.logo}>
            <SvgImage screenWidthRelativeSize={0.346} type="transparent-logo" />
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing[6],
    paddingBottom: spacing[13],
    flexDirection: 'column',
    flexGrow: 1,
  },
  appVersionText: {
    textAlign: 'center',
    paddingTop: spacing[6],
  },
  spacer: {
    flexGrow: 1,
    minHeight: spacing[6],
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
})
