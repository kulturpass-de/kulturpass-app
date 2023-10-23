import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { Illustration } from '../../../components/illustration/illustration'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { getDisplayVersion } from '../utils/get-display-version'
import { ReleaseNotesBulletList } from './release-notes-bullet-list'

const releaseVersion = getDisplayVersion()

export type ReleaseNotesProps = {
  testID: string
  headerTitleI18nKey: AvailableTranslations
  bodyTitleI18nKey: AvailableTranslations
  bodyTextGenericI18nKey: AvailableTranslations
  bodyTextListBaseI18nKey: string
  acceptButtonI18nKey: AvailableTranslations
  onPressOk: () => void
}

type ReleaseNotesViewProps = Pick<
  ReleaseNotesProps,
  'bodyTitleI18nKey' | 'bodyTextGenericI18nKey' | 'bodyTextListBaseI18nKey'
>

export const ReleaseNotesView: React.FC<ReleaseNotesViewProps> = ({
  bodyTitleI18nKey,
  bodyTextGenericI18nKey,
  bodyTextListBaseI18nKey,
}) => {
  const { colors } = useTheme()
  const { buildTestId } = useTestIdBuilder()

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
      <Illustration
        testID={buildTestId('release_notes_img_alt')}
        type="release-notes"
        i18nKey="release_notes_img_alt"
      />
      <TranslatedText
        i18nKey={bodyTitleI18nKey}
        testID={bodyTitleI18nKey}
        textStyle="HeadlineH3Extrabold"
        textStyleOverrides={[styles.headline, { color: colors.labelColor }]}
        i18nParams={{ releaseVersion }}
      />
      <TranslatedText
        i18nKey={bodyTextGenericI18nKey}
        testID={bodyTextGenericI18nKey}
        textStyle="BodyRegular"
        textStyleOverrides={[styles.text, { color: colors.labelColor }]}
      />
      <ReleaseNotesBulletList bodyTextListBaseI18nKey={bodyTextListBaseI18nKey} />
    </ScrollView>
  )
}

export const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: spacing[6],
    paddingHorizontal: spacing[5],
    rowGap: spacing[6],
  },
  headline: {
    alignSelf: 'center',
  },
  text: {
    paddingBottom: spacing[2],
  },
})
