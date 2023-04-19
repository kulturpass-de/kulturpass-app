import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { spacing } from '../../../theme/spacing'
import { CertificateMessage } from '@jolocom/react-native-ausweis/js/messageTypes'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useTranslation } from '../../../services/translation/translation'
import { colors } from '../../../theme/colors'
import { textStyles } from '../../../theme/typography'

export type EidServiceProviderDetailsScreenProps = {
  certificate: CertificateMessage
  onBack: () => void
  onClose: () => void
}

export const EidServiceProviderDetailsScreen: React.FC<EidServiceProviderDetailsScreenProps> = ({
  certificate,
  onBack,
  onClose,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const { l: language } = useTranslation()

  const subject = `${certificate.description.subjectName}\n${certificate.description.subjectUrl}`

  const issuer = `${certificate.description.issuerName}\n${certificate.description.issuerUrl}`

  const { termsOfUsage } = certificate.description

  const validity = useMemo(() => {
    const effectiveDate = new Date(certificate.validity.effectiveDate)
    const expirationDate = new Date(certificate.validity.expirationDate)
    return `${effectiveDate.toLocaleDateString(language)} - ${expirationDate.toLocaleDateString(language)}`
  }, [certificate.validity.effectiveDate, certificate.validity.expirationDate, language])

  return (
    <ModalScreen testID={buildTestId('eid_serviceProviderDetails')}>
      <ModalScreenHeader
        testID={buildTestId('eid_serviceProviderDetails_title')}
        titleI18nKey="eid_serviceProviderDetails_title"
        onPressClose={onClose}
        onPressBack={onBack}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.item}>
          <TranslatedText
            textStyle="SubtitleSemibold"
            i18nKey="eid_serviceProviderDetails_subject_title"
            testID={buildTestId('eid_serviceProviderDetails_subject_title')}
            textStyleOverrides={styles.itemTitle}
          />
          <Text
            style={[textStyles.BodyRegular, styles.text]}
            accessible
            testID={buildTestId('eid_serviceProviderDetails_subject_content')}>
            {subject}
          </Text>
        </View>
        <View style={styles.item}>
          <TranslatedText
            textStyle="SubtitleSemibold"
            i18nKey="eid_serviceProviderDetails_issuer_title"
            testID={buildTestId('eid_serviceProviderDetails_issuer_title')}
            textStyleOverrides={styles.itemTitle}
          />
          <Text
            style={[textStyles.BodyRegular, styles.text]}
            accessible
            testID={buildTestId('eid_serviceProviderDetails_issuer_content')}>
            {issuer}
          </Text>
        </View>
        <View style={styles.item}>
          <TranslatedText
            textStyle="SubtitleSemibold"
            i18nKey="eid_serviceProviderDetails_termsOfUsage_title"
            testID={buildTestId('eid_serviceProviderDetails_termsOfUsage_title')}
            textStyleOverrides={styles.itemTitle}
          />
          <Text
            style={[textStyles.BodyRegular, styles.text]}
            accessible
            testID={buildTestId('eid_serviceProviderDetails_termsOfUsage_content')}>
            {termsOfUsage}
          </Text>
        </View>
        <View style={styles.item}>
          <TranslatedText
            textStyle="SubtitleSemibold"
            i18nKey="eid_serviceProviderDetails_validity_title"
            testID={buildTestId('eid_serviceProviderDetails_validity_title')}
            textStyleOverrides={styles.itemTitle}
          />
          <Text
            style={[textStyles.BodyRegular, styles.text]}
            accessible
            testID={buildTestId('eid_serviceProviderDetails_validity_content')}>
            {validity}
          </Text>
        </View>
      </ScrollView>
    </ModalScreen>
  )
}

export const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingTop: spacing[6],
    paddingHorizontal: spacing[5],
  },
  item: {
    paddingBottom: spacing[6],
    flexDirection: 'column',
  },
  itemTitle: {
    paddingBottom: spacing[1],
    color: colors.basicBlack,
  },
  text: {
    color: colors.basicBlack,
  },
})
