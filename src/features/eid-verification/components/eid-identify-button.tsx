import React, { useCallback } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '../../../components/icon/icon'
import { InfoBox } from '../../../components/info-box/info-box'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useUserInfo } from '../../../services/user/use-user-info'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { EidAboutVerificationRouteName } from '../screens/eid-about-verification-route'

export const EidIdentifyButton: React.FC = () => {
  const { buildTestId } = useTestIdBuilder()
  const modalNavigation = useModalNavigation()
  const { firstName } = useUserInfo()

  const startVerification = useCallback(() => {
    modalNavigation.navigate({ screen: EidAboutVerificationRouteName })
  }, [modalNavigation])

  return (
    <Pressable onPress={startVerification} accessible accessibilityRole="button">
      <InfoBox containerStyle={styles.container}>
        <View style={styles.shrink}>
          <TranslatedText
            testID={buildTestId('eid_startVerify_button_title')}
            i18nKey={'eid_startVerify_button_title'}
            i18nParams={{ name: firstName }}
            textStyle="HeadlineH4Extrabold"
            textStyleOverrides={{ color: colors.moonDarkest }}
          />
          <View style={styles.content}>
            <Icon source="IDCard" width={36} height={36} />
            <TranslatedText
              textStyleOverrides={styles.text}
              testID={buildTestId('eid_startVerify_button_text')}
              i18nKey="eid_startVerify_button_text"
              textStyle="BodySmallMedium"
            />
            <Icon source="Chevron" height={24} width={24} tintColor={colors.basicBlack} />
          </View>
        </View>
      </InfoBox>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    flexShrink: 1,
    paddingVertical: spacing[2],
  },
  text: {
    marginLeft: 14,
    paddingRight: spacing[4],
    flexShrink: 1,
    flexWrap: 'wrap',
    color: colors.moonDarkest,
  },
  shrink: {
    flexShrink: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.secondaryLighter,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    overflow: 'hidden',
  },
})
