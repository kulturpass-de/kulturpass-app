import React, { useCallback } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { InfoBox } from '../../../../components/info-box/info-box'
import { SvgImage } from '../../../../components/svg-image/svg-image'
import { TranslatedText } from '../../../../components/translated-text/translated-text'
import { useModalNavigation } from '../../../../navigation/modal/hooks'
import { LogInRouteName } from '../../../../screens/auth/log-in-route'
import { useTestIdBuilder } from '../../../../services/test-id/test-id'
import { useTranslation } from '../../../../services/translation/translation'
import { useTheme } from '../../../../theme/hooks/use-theme'
import { spacing } from '../../../../theme/spacing'

export const RegisterNowButton: React.FC = () => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()
  const modalNavigation = useModalNavigation()
  const { t } = useTranslation()

  const startVerification = useCallback(() => {
    modalNavigation.navigate({ screen: LogInRouteName })
  }, [modalNavigation])

  return (
    <Pressable
      onPress={startVerification}
      accessible
      accessibilityRole="button"
      accessibilityLabel={t('register_now_button_title')}
      accessibilityHint={t('register_now_button_text')}>
      <InfoBox containerStyle={styles.container} testID={buildTestId('register_now_button_container')}>
        <View style={styles.shrink}>
          <TranslatedText
            testID={buildTestId('register_now_button_title')}
            i18nKey={'register_now_button_title'}
            textStyle="HeadlineH4Extrabold"
            textStyleOverrides={{ color: colors.labelColor }}
          />
          <View style={styles.content}>
            <SvgImage type="id-card" width={36} height={36} />
            <TranslatedText
              textStyleOverrides={[styles.text, { color: colors.labelColor }]}
              testID={buildTestId('register_now_button_text')}
              i18nKey="register_now_button_text"
              textStyle="BodySmallMedium"
            />
            <SvgImage type="chevron" height={24} width={24} /* tintColor={colors.labelColor} */ />
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
