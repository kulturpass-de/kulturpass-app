import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Icon } from '../../../components/icon/icon'
import { LinkTextInline } from '../../../components/link-text/link-text-inline'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { buildTestId } from '../../../services/test-id/test-id'
import { useUserInfo } from '../../../services/user/use-user-info'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { useFaqLink } from '../../../services/faq-configuration/hooks/use-faq-link'

export const VerificationDuplicateHeader: React.FC = () => {
  const { firstName } = useUserInfo()
  const identificationStatusDuplicateFaqLink = useFaqLink('IDENTIFICATION_STATUS_DUPLICATE')

  return (
    <View style={styles.container} focusable>
      <View style={styles.shadow} />
      <View style={styles.innerContainer}>
        <View style={styles.shrink}>
          <TranslatedText
            testID={buildTestId('verification_duplicate_title')}
            i18nKey="verification_duplicate_title"
            i18nParams={{ name: firstName }}
            textStyle="HeadlineH4Extrabold"
            textStyleOverrides={{ color: colors.moonDarkest }}
          />
          <View style={styles.content}>
            <Icon source="Attention" width={36} height={36} />
            <View style={styles.textWrapper}>
              <TranslatedText
                textStyleOverrides={styles.text}
                testID={buildTestId('verification_duplicate_text')}
                i18nKey="verification_duplicate_text"
                textStyle="BodySmallMedium"
              />
              <LinkTextInline
                textStyle="BodySmallMedium"
                link={identificationStatusDuplicateFaqLink}
                i18nKey="verification_duplicate_text_link"
                iconSize={20}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[1],
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
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.secondaryLighter,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    marginTop: spacing[5],
    marginRight: spacing[5],
    flexShrink: 1,
  },
  textWrapper: {
    flexDirection: 'column',
    marginLeft: spacing[4],
    marginRight: spacing[5],
  },
  text: {
    flexShrink: 1,
    flexWrap: 'wrap',
    color: colors.moonDarkest,
  },
  shrink: {
    flexShrink: 1,
  },
})
