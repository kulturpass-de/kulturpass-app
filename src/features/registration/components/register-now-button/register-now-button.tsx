import React, { useCallback } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useModalNavigation } from '../../../../navigation/modal/hooks'
import { useTestIdBuilder } from '../../../../services/test-id/test-id'
import { LogInRouteName } from '../../../../screens/log-in/log-in-route'
import { InfoBox } from '../../../../components/info-box/info-box'
import { TranslatedText } from '../../../../components/translated-text/translated-text'
import { Icon } from '../../../../components/icon/icon'
import { colors } from '../../../../theme/colors'
import { spacing } from '../../../../theme/spacing'

export const RegisterNowButton: React.FC = () => {
  const { buildTestId } = useTestIdBuilder()
  const modalNavigation = useModalNavigation()

  const startVerification = useCallback(() => {
    modalNavigation.navigate({ screen: LogInRouteName })
  }, [modalNavigation])

  return (
    <Pressable onPress={startVerification} accessible accessibilityRole="button">
      <InfoBox containerStyle={styles.container}>
        <View style={styles.shrink}>
          <TranslatedText
            testID={buildTestId('register_now_button_title')}
            i18nKey={'register_now_button_title'}
            textStyle="HeadlineH4Extrabold"
            textStyleOverrides={{ color: colors.moonDarkest }}
          />
          <View style={styles.content}>
            <Icon source="IDCard" width={36} height={36} />
            <TranslatedText
              textStyleOverrides={styles.text}
              testID={buildTestId('register_now_button_text')}
              i18nKey="register_now_button_text"
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
