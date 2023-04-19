import React, { useCallback } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from '../../../components/button/button'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { AccessRightsMessage, CertificateMessage } from '@jolocom/react-native-ausweis/js/messageTypes'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { Icon } from '../../../components/icon/icon'
import { useTranslation } from '../../../services/translation/translation'
import { textStyles } from '../../../theme/typography'
import { AccessRightsFields } from '@jolocom/react-native-ausweis/js/types'

export type EidAboutServiceProviderScreenProps = {
  accessRights: AccessRightsMessage
  certificate: CertificateMessage
  onProviderDetails: () => void
  onNext: () => void
  onClose: () => void
}

export const EidAboutServiceProviderScreen: React.FC<EidAboutServiceProviderScreenProps> = ({
  certificate,
  accessRights,
  onProviderDetails,
  onNext,
  onClose,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const { t } = useTranslation()

  const renderItem = useCallback(
    (item: AccessRightsFields) => {
      const accessRightI18NKey = `eid_aboutServiceProvider_accessRights_${item.toLowerCase()}`
      return (
        <Text
          key={item}
          accessible
          testID={buildTestId(accessRightI18NKey)}
          style={[textStyles.BodyRegular, styles.text]}>{`\u2022 ${t(accessRightI18NKey)}`}</Text>
      )
    },
    [t, buildTestId],
  )

  const subjectName = certificate.description.subjectName

  const effectiveAccessRights = accessRights.chat.effective

  return (
    <ModalScreen whiteBottom testID={buildTestId('eid_aboutServiceProvider')}>
      <ModalScreenHeader
        testID={buildTestId('eid_aboutServiceProvider_title')}
        titleI18nKey="eid_aboutServiceProvider_title"
        onPressClose={onClose}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContainer}>
        <TranslatedText
          i18nKey="eid_aboutServiceProvider_subtitle"
          testID={buildTestId('eid_aboutServiceProvider_subtitle')}
          textStyle="BodyRegular"
          textStyleOverrides={styles.text}
        />
        <Pressable
          accessible
          testID={buildTestId('eid_aboutServiceProvider_details_button')}
          style={styles.providerButton}
          onPress={onProviderDetails}>
          <Icon source="Government" width={36} height={36} />
          <Text
            numberOfLines={3}
            accessible
            testID={buildTestId('eid_aboutServiceProvider_details_button_text')}
            style={[textStyles.BodyBold, styles.providerButtonText]}>
            {subjectName}
          </Text>
          <Icon source="Chevron" width={24} height={24} />
        </Pressable>
        <TranslatedText
          i18nKey="eid_aboutServiceProvider_accessRights_title"
          testID={buildTestId('eid_aboutServiceProvider_accessRights_title')}
          textStyle="SubtitleSemibold"
          textStyleOverrides={styles.text}
        />
        <TranslatedText
          i18nKey="eid_aboutServiceProvider_accessRights_subtitle"
          testID={buildTestId('eid_aboutServiceProvider_accessRights_subtitle')}
          textStyle="BodyRegular"
          textStyleOverrides={styles.accessRightsSubtitle}
        />
        <View>{effectiveAccessRights.map(renderItem)}</View>
      </ScrollView>
      <View style={styles.buttonFooter}>
        <Button
          onPress={onNext}
          variant="primary"
          testID={buildTestId('eid_aboutServiceProvider_accept_button')}
          i18nKey="eid_aboutServiceProvider_accept_button"
        />
      </View>
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
  providerButton: {
    borderRadius: 16,
    backgroundColor: colors.basicWhite,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    marginVertical: spacing[6],
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  providerButtonText: {
    paddingLeft: spacing[5],
    paddingRight: spacing[4],
    color: colors.basicBlack,
    flex: 1,
    flexGrow: 1,
  },
  accessRightsSubtitle: {
    paddingTop: spacing[5],
    paddingBottom: spacing[6],
    color: colors.basicBlack,
  },
  text: {
    color: colors.basicBlack,
  },
  buttonFooter: {
    padding: spacing[5],
    backgroundColor: colors.basicWhite,
    borderTopWidth: 2,
    borderTopColor: colors.basicBlack,
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    height: 80,
  },
})
