import React from 'react'
import { StyleSheet, View } from 'react-native'
import { LinkText } from '../../../components/link-text/link-text'
import { useFaqLink } from '../../../services/faq-configuration/hooks/use-faq-link'
import { addTestIdModifier, buildTestId } from '../../../services/test-id/test-id'
import { spacing } from '../../../theme/spacing'
import {
  useLocalizedEnvironmentUrl,
  getCdcDpsDocumentUrl,
} from '../../../utils/links/hooks/use-localized-environment-url'

export const MobilityOffersLinkView: React.FC = () => {
  const testID = buildTestId('mobile_offers_product_link')
  const ftGeneralFaqLink = useFaqLink('VOUCHER_CAMPAIGN_FLIXTRAIN')
  const linkToDetailedPage = useLocalizedEnvironmentUrl(getCdcDpsDocumentUrl)

  return (
    <View style={styles.container}>
      <View style={styles.textPadding}>
        <LinkText
          textStyle="BodySmallSemibold"
          testID={addTestIdModifier(testID, 'faq')}
          i18nKey="mobility-offers-ft-link-2"
          link={ftGeneralFaqLink}
        />
      </View>
      <View style={styles.textPadding}>
        <LinkText
          textStyle="BodySmallSemibold"
          testID={addTestIdModifier(testID, 'detail')}
          i18nKey="mobility-offers-ft-link-3"
          link={linkToDetailedPage}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing[8],
  },
  textPadding: {
    paddingTop: spacing[6],
  },
})
