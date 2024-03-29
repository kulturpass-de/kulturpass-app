import { Certificate } from '@sap/react-native-ausweisapp2-wrapper'
import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { LinkTextInline } from '../../../components/link-text/link-text-inline'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useTextStyles } from '../../../theme/hooks/use-text-styles'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'

const Item = ({
  content,
  name,
  link,
}: {
  content: string
  link?: string
  name: 'subject' | 'issuer' | 'termsOfUsage' | 'validity'
}) => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()
  const [textStyles] = useTextStyles()

  const contentTextStyle = [textStyles.BodyRegular, { color: colors.labelColor }]

  return (
    <View style={styles.item}>
      <TranslatedText
        accessibilityRole="header"
        textStyle="SubtitleSemibold"
        i18nKey={`eid_serviceProviderDetails_${name}_title`}
        testID={buildTestId(`eid_serviceProviderDetails_${name}_title`)}
        textStyleOverrides={[styles.itemTitle, { color: colors.labelColor }]}
      />
      <Text style={contentTextStyle} accessible testID={buildTestId(`eid_serviceProviderDetails_${name}_content`)}>
        {content}
      </Text>

      {link && <LinkTextInline link={link} i18nKey={link as any} textStyleOverrides={contentTextStyle} />}
    </View>
  )
}

export type EidServiceProviderDetailsScreenProps = {
  certificate: Certificate
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
        <Item content={certificate.description.subjectName} name="subject" link={certificate.description.subjectUrl} />
        <Item content={certificate.description.issuerName} name="issuer" link={certificate.description.issuerUrl} />
        <Item content={termsOfUsage} name="termsOfUsage" />
        <Item content={validity} name="validity" />
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
  },
})
