import React from 'react'
import { StyleSheet, View } from 'react-native'
import { LinkText } from '../../../components/link-text/link-text'
import { useFaqLink } from '../../../services/faq-configuration/hooks/use-faq-link'
import { useTestIdBuilder } from '../../../services/test-id/test-id'

export type AboutPinLinkSection = {
  type: 'pin' | 'can' | 'puk'
  showResetPin: boolean
}

export const AboutPinLinkSection: React.FC<AboutPinLinkSection> = ({ type, showResetPin }) => {
  const { buildTestId } = useTestIdBuilder()
  const link_i18nKey = `eid_${type}_faq_link` as const
  const faqEntryName = `EID_${type.toUpperCase() as Uppercase<typeof type>}` as const
  const pinFaqLink = useFaqLink(faqEntryName)
  const resetPinFaqLink = useFaqLink('EID_PIN_RESET')

  return (
    <View style={styles.links}>
      {showResetPin ? (
        <View style={styles.linkPadding}>
          <LinkText
            i18nKey="eid_resetPin_link"
            testID={buildTestId('eid_resetPin_link')}
            link={resetPinFaqLink}
            textStyle="BodySmallMedium"
          />
        </View>
      ) : null}
      <LinkText
        i18nKey={link_i18nKey}
        testID={buildTestId(link_i18nKey)}
        link={pinFaqLink}
        textStyle="BodySmallMedium"
      />
    </View>
  )
}

export const styles = StyleSheet.create({
  links: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  linkPadding: {
    paddingBottom: 18,
  },
})
