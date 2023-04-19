import React, { useCallback } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import { Icon } from '../../../components/icon/icon'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { selectUserProfile } from '../../../services/user/redux/user-selectors'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'

export const EidIdentifyButton: React.FC = () => {
  const { buildTestId } = useTestIdBuilder()
  const modalNavigation = useModalNavigation()
  const userData = useSelector(selectUserProfile)

  const startVerification = useCallback(() => {
    modalNavigation.navigate({ screen: 'EidAboutVerification' })
  }, [modalNavigation])

  return (
    <Pressable style={styles.button} onPress={startVerification}>
      <View style={styles.shadow} />
      <View style={styles.container}>
        <View style={styles.shrink}>
          <TranslatedText
            testID={buildTestId('eid_startVerify_button_title')}
            i18nKey="eid_startVerify_button_title"
            i18nParams={{ name: userData?.firstName ?? '' }}
            textStyle="HeadlineH4Extrabold"
            textStyleOverrides={{ color: colors.moonDarkest }}
          />
          <View style={styles.content}>
            <Icon source="VerifyID" width={36} height={36} />
            <TranslatedText
              textStyleOverrides={styles.text}
              testID={buildTestId('eid_startVerify_button_text')}
              i18nKey="eid_startVerify_button_text"
              textStyle="BodySmallMedium"
            />
          </View>
        </View>
        <Icon source="Chevron" height={24} width={24} tintColor={colors.basicBlack} />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 16.5,
    marginBottom: 3,
  },
  shadow: {
    position: 'absolute',
    top: 3,
    left: 3,
    backgroundColor: colors.basicBlack,
    borderRadius: 16,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  content: {
    flexDirection: 'row',
    marginTop: 18,
    flexShrink: 1,
  },
  text: {
    marginLeft: 14,
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
    paddingTop: 12,
    paddingBottom: 24,
    overflow: 'hidden',
  },
})
