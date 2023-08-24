import React from 'react'
import { Screen } from '../../../components/screen/screen'
import { ScreenHeader } from '../../../components/screen/screen-header'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { ReleaseNotesProps, ReleaseNotesView } from '../components/release-notes-view'

export type ReleaseNotesScreenProps = Pick<
  ReleaseNotesProps,
  | 'headerTitleI18nKey'
  | 'bodyTextGenericI18nKey'
  | 'bodyTextListBaseI18nKey'
  | 'bodyTitleI18nKey'
  | 'onPressOk'
  | 'testID'
>

export const ReleaseNotesScreen: React.FC<ReleaseNotesScreenProps> = ({
  testID,
  headerTitleI18nKey,
  onPressOk,
  ...sharedProps
}) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()

  const SCREEN_TEST_ID = buildTestId(testID)

  return (
    <Screen
      testID={SCREEN_TEST_ID}
      header={
        <ScreenHeader
          testID={buildTestId(headerTitleI18nKey)}
          title={t(headerTitleI18nKey)}
          onPressBack={onPressOk}
          screenType="subscreen"
        />
      }>
      <ReleaseNotesView {...sharedProps} />
    </Screen>
  )
}
