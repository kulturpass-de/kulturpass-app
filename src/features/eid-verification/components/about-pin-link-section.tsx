import React from 'react'
import { StyleSheet, View } from 'react-native'
import { LinkText } from '../../../components/link-text/link-text'

export type AboutPinLinkSection = {
  type: 'pin' | 'can'
  showResetPin: boolean
}

export const AboutPinLinkSection: React.FC<AboutPinLinkSection> = ({ type, showResetPin }) => {
  return (
    <View style={styles.links}>
      {showResetPin ? (
        <View style={styles.linkPadding}>
          <LinkText i18nKey="eid_resetPin_link" link="https://www.sap.de" textStyle="BodySmallMedium" />
        </View>
      ) : null}
      <LinkText
        i18nKey={type === 'pin' ? 'eid_pin_faq_link' : 'eid_can_faq_link'}
        link={type === 'pin' ? 'https://www.sap.de' : 'https://www.sap.de'} // TODO: Insert correct faq links
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
