import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { InfoBox } from '../../../components/info-box/info-box'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { RootStackParams } from '../../../navigation/types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useUserInfo } from '../../../services/user/use-user-info'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { EidAboutVerificationRouteName } from '../screens/eid-about-verification-route'

export const EidIdentifyButton: React.FC = () => {
  const { buildTestId } = useTestIdBuilder()
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>()
  const { colors } = useTheme()
  const { name } = useUserInfo()
  const { t } = useTranslation()

  const startVerification = useCallback(() => {
    navigation.navigate('Eid', { screen: EidAboutVerificationRouteName })
  }, [navigation])

  return (
    <Pressable
      onPress={startVerification}
      accessible
      accessibilityRole="button"
      accessibilityLabel={t(name ? 'eid_startVerify_button_title' : 'eid_startVerify_button_title_withoutName', {
        name,
      })}
      accessibilityHint={t('eid_startVerify_button_text')}>
      {/* Do NOT remove the testID,
          otherwise the views contained testIDs will not be found on iOS (bug) */}
      <InfoBox containerStyle={styles.container} testID={buildTestId('eid_startVerify_button_container')}>
        <View style={styles.shrink}>
          <TranslatedText
            testID={buildTestId('eid_startVerify_button_title')}
            i18nKey={name ? 'eid_startVerify_button_title' : 'eid_startVerify_button_title_withoutName'}
            i18nParams={{ name }}
            textStyle="HeadlineH4Extrabold"
            textStyleOverrides={{ color: colors.labelColor }}
          />
          <View style={styles.content}>
            <SvgImage type="id-card" width={36} height={36} />
            <TranslatedText
              textStyleOverrides={[styles.text, { color: colors.labelColor }]}
              testID={buildTestId('eid_startVerify_button_text')}
              i18nKey="eid_startVerify_button_text"
              textStyle="BodySmallMedium"
            />
            <SvgImage type="chevron" height={24} width={24} /*tintColor={colors.labelColor} */ />
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
  },
  shrink: {
    flexShrink: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    overflow: 'hidden',
  },
})
