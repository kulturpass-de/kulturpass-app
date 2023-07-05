import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from '../../../components/button/button'
import { Illustration } from '../../../components/illustration/illustration'
import { LinkText } from '../../../components/link-text/link-text'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useFaqLink } from '../../../services/faq-configuration/hooks/use-faq-link'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'

export type EidPukInoperativeScreenProps = {
  onClose: () => void
}

export const EidPukInoperativeScreen: React.FC<EidPukInoperativeScreenProps> = ({ onClose }) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const eidGeneralFaqLink = useFaqLink('EID_IDENTIFICATION_GENERAL')

  const screenTestId = buildTestId('eid_pukInoperative')

  return (
    <ModalScreen whiteBottom testID={screenTestId}>
      <ModalScreenHeader
        testID={addTestIdModifier(screenTestId, 'title')}
        titleI18nKey="eid_pukInoperative_title"
        onPressClose={onClose}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <Illustration testID={buildTestId('stopSign_image_alt')} i18nKey="stopSign_image_alt" type="stop-sign" />
        <View style={styles.contentContainer}>
          <TranslatedText
            textStyleOverrides={styles.contentTitle}
            testID={addTestIdModifier(screenTestId, 'content_title')}
            i18nKey="eid_pukInoperative_content_title"
            textStyle="HeadlineH4Extrabold"
          />
          <TranslatedText
            textStyleOverrides={styles.contentText}
            testID={addTestIdModifier(screenTestId, 'content_text')}
            i18nKey="eid_pukInoperative_content_text"
            textStyle="BodyRegular"
          />
          <View style={styles.linkContainer}>
            <LinkText
              testID={addTestIdModifier(screenTestId, 'content_link')}
              i18nKey="eid_pukInoperative_content_link"
              link={eidGeneralFaqLink}
            />
          </View>
        </View>
      </ScrollView>
      <ModalScreenFooter>
        <Button
          onPress={onClose}
          variant="primary"
          testID={addTestIdModifier(screenTestId, 'ok_button')}
          i18nKey="eid_pukInoperative_ok_button"
        />
      </ModalScreenFooter>
    </ModalScreen>
  )
}

export const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
  },
  contentTitle: {
    paddingTop: spacing[7],
    flexWrap: 'wrap',
    color: colors.moonDarker,
  },
  contentText: {
    paddingTop: spacing[7],
    color: colors.moonDarkest,
  },
  linkContainer: {
    paddingTop: spacing[9],
  },
})
