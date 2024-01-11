import { AccessRight, AccessRights, Certificate } from '@sap/react-native-ausweisapp2-wrapper'
import React, { useCallback } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from '../../../components/button/button'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { HITSLOP } from '../../../theme/constants'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'

export type EidAboutServiceProviderScreenProps = {
  accessRights: AccessRights
  certificate: Certificate
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
  const { colors } = useTheme()
  const { t } = useTranslation()

  const renderItem = useCallback(
    (item: AccessRight) => {
      const type = item.toLowerCase() as Lowercase<AccessRight>
      const accessRightI18NKey = `eid_aboutServiceProvider_accessRights_${type}` as const
      const accessRightText = t(accessRightI18NKey as any, '' as any)
      const accessibilityLabel =
        item === 'GivenNames' ? t('eid_aboutServiceProvider_accessRights_givennames_label') : undefined

      if (!accessRightText) {
        return null
      }

      return (
        <Text
          key={item}
          accessible
          accessibilityLabel={accessibilityLabel}
          testID={buildTestId(accessRightI18NKey)}
          style={[textStyles.BodyRegular, { color: colors.labelColor }]}>{`\u2022 ${accessRightText}`}</Text>
      )
    },
    [t, buildTestId, colors.labelColor],
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
          textStyleOverrides={{ color: colors.labelColor }}
        />
        <Pressable
          accessible
          accessibilityRole="button"
          hitSlop={HITSLOP}
          testID={buildTestId('eid_aboutServiceProvider_details_button')}
          style={[styles.providerButton, { backgroundColor: colors.secondaryBackground }]}
          onPress={onProviderDetails}>
          <SvgImage type="government" width={36} height={36} />
          <Text
            numberOfLines={3}
            accessible
            testID={buildTestId('eid_aboutServiceProvider_details_button_text')}
            style={[textStyles.BodyBold, styles.providerButtonText, { color: colors.labelColor }]}>
            {subjectName}
          </Text>
          <SvgImage type="chevron" width={24} height={24} />
        </Pressable>
        <TranslatedText
          i18nKey="eid_aboutServiceProvider_accessRights_title"
          testID={buildTestId('eid_aboutServiceProvider_accessRights_title')}
          textStyle="SubtitleSemibold"
          textStyleOverrides={{ color: colors.labelColor }}
        />
        <TranslatedText
          i18nKey="eid_aboutServiceProvider_accessRights_subtitle"
          testID={buildTestId('eid_aboutServiceProvider_accessRights_subtitle')}
          textStyle="BodyRegular"
          textStyleOverrides={[styles.accessRightsSubtitle, { color: colors.labelColor }]}
        />
        <View>{effectiveAccessRights.map(renderItem)}</View>
      </ScrollView>
      <ModalScreenFooter>
        <Button
          onPress={onNext}
          variant="primary"
          testID={buildTestId('eid_aboutServiceProvider_accept_button')}
          i18nKey="eid_aboutServiceProvider_accept_button"
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
    paddingTop: spacing[6],
    paddingHorizontal: spacing[5],
  },
  providerButton: {
    borderRadius: 16,
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
    flex: 1,
    flexGrow: 1,
  },
  accessRightsSubtitle: {
    paddingTop: spacing[5],
    paddingBottom: spacing[6],
  },
})
