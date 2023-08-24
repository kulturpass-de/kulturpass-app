import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import { Button } from '../button/button'
import { ModalScreen } from '../modal-screen/modal-screen'
import { ModalScreenFooter } from '../modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../modal-screen/modal-screen-header'
import { ScreenContent } from '../screen/screen-content'
import { TranslatedText } from '../translated-text/translated-text'
import { AvailableTranslations } from '../translated-text/types'

type ReportScreenProps = React.PropsWithChildren<{
  screenKey: string
  headlineTitleI18nKey: AvailableTranslations
  bodyTitleI18nKey: AvailableTranslations
  footerAcceptI18nKey: AvailableTranslations
  footerAbortI18nKey: AvailableTranslations
  onPressAccept: () => void
  onPressAbort: () => void
}>

export const ReportScreen: React.FC<ReportScreenProps> = ({
  screenKey,
  headlineTitleI18nKey,
  bodyTitleI18nKey,
  footerAcceptI18nKey,
  footerAbortI18nKey,
  onPressAccept,
  onPressAbort,
  children,
}) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()

  const testID = buildTestId(screenKey)

  return (
    <ModalScreen whiteBottom testID={testID}>
      <ModalScreenHeader
        titleI18nKey={headlineTitleI18nKey}
        testID={addTestIdModifier(testID, 'headline_title')}
        onPressClose={onPressAbort}
      />

      <ScreenContent style={{ paddingHorizontal: spacing[5], paddingVertical: spacing[6] }}>
        <TranslatedText
          textStyleOverrides={[styles.text, { color: colors.labelColor }]}
          testID={addTestIdModifier(testID, 'body_title')}
          i18nKey={bodyTitleI18nKey}
          textStyle="HeadlineH3Extrabold"
        />
        <View style={styles.bodyContainer}>{children}</View>
      </ScreenContent>

      <ModalScreenFooter>
        <Button
          onPress={onPressAccept}
          variant="primary"
          testID={addTestIdModifier(testID, 'accept_button')}
          i18nKey={footerAcceptI18nKey}
        />
        <Button
          onPress={onPressAbort}
          variant="transparent"
          testID={addTestIdModifier(testID, 'abort_button')}
          i18nKey={footerAbortI18nKey}
        />
      </ModalScreenFooter>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  text: {
    marginBottom: spacing[6],
    textAlign: 'center',
  },
  bodyContainer: { width: '100%' },
})
