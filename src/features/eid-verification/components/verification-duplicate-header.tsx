import React from 'react'
import { StyleSheet, View } from 'react-native'
import { LinkTextInline } from '../../../components/link-text/link-text-inline'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useFaqLink } from '../../../services/faq-configuration/hooks/use-faq-link'
import { buildTestId } from '../../../services/test-id/test-id'
import { useUserInfo } from '../../../services/user/use-user-info'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'

export const VerificationDuplicateHeader: React.FC = () => {
  const { colors } = useTheme()

  const { name } = useUserInfo()
  const identificationStatusDuplicateFaqLink = useFaqLink('IDENTIFICATION_STATUS_DUPLICATE')

  return (
    <View style={styles.container}>
      <View style={[styles.shadow, { backgroundColor: colors.boxShadow }]} />
      <View style={[styles.innerContainer, { backgroundColor: colors.infoBox }]}>
        <View style={styles.shrink}>
          <TranslatedText
            testID={buildTestId('verification_duplicate_title')}
            i18nKey={name ? 'verification_duplicate_title' : 'verification_duplicate_title_withoutName'}
            i18nParams={{ name }}
            textStyle="HeadlineH4Extrabold"
            textStyleOverrides={{ color: colors.labelColor }}
          />
          <View style={styles.content}>
            <SvgImage type="attention" width={36} height={36} />
            <View style={styles.textWrapper}>
              <TranslatedText
                textStyleOverrides={[styles.text, { color: colors.labelColor }]}
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
    borderRadius: 16,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
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
  },
  shrink: {
    flexShrink: 1,
  },
})
