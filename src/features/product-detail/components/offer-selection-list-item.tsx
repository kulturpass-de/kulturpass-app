import React, { useCallback, useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from '../../../components/button/button'
import { GoToSearchButton } from '../../../components/go-to-search-button/go-to-search-button'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useTextStyles } from '../../../theme/hooks/use-text-styles'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { useFormattedPrice } from '../../../utils/price/hooks/use-formatted-price'

type OfferSelectionListItemProps = {
  offer: Offer
  isVoucher: boolean
  onPress: (offerId: Offer['id']) => void
}

export const OfferSelectionListItem: React.FC<OfferSelectionListItemProps> = ({ offer, isVoucher, onPress }) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const textStyles = useTextStyles()

  const formattedPrice = useFormattedPrice(offer.price)
  const onButtonPress = useCallback(() => {
    onPress(offer.id)
  }, [onPress, offer.id])

  const addressText = useMemo(() => {
    if (offer.shopDistance) {
      return t('offerSelection_offer_address', {
        distance: offer.shopDistance,
        ...offer.shopAddress,
      })
    } else {
      return t('offerSelection_offer_address_withoutDistance', {
        ...offer.shopAddress,
      })
    }
  }, [offer.shopAddress, offer.shopDistance, t])

  const testID = buildTestId('offerSelection_offer')

  return (
    <View style={styles.container}>
      <View accessible style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <GoToSearchButton
            searchTerm={offer.shopName}
            accessibilityLabel={offer.shopName}
            lineHeight={textStyles.SubtitleExtrabold.lineHeight}
            childrenContainerStyle={styles.goToSearchButtonChildrenContainerStyle}
            testID={addTestIdModifier(testID, 'shopName_button')}>
            <Text
              testID={addTestIdModifier(testID, 'shopName')}
              style={[textStyles.SubtitleExtrabold, styles.shopName, { color: colors.labelColor }]}>
              {offer.shopName}
            </Text>
          </GoToSearchButton>
          {formattedPrice ? (
            <Text
              testID={addTestIdModifier(testID, 'price')}
              style={[textStyles.SubtitleBlack, { color: colors.labelColor }, styles.formattedPrice]}>
              {formattedPrice}
            </Text>
          ) : null}
        </View>
        <Text
          testID={addTestIdModifier(testID, 'address')}
          style={[textStyles.BodyRegular, styles.address, { color: colors.labelColor }]}>
          {addressText}
        </Text>
        {offer.priceAdditionalInfo ? (
          <Text
            testID={addTestIdModifier(testID, 'priceAdditionalInfo')}
            style={[textStyles.BodyBold, { color: colors.labelColor }]}>
            {offer.priceAdditionalInfo}
          </Text>
        ) : null}
      </View>
      <Button
        onPress={onButtonPress}
        variant="secondary"
        i18nKey={isVoucher ? 'offerSelection_offer_voucher_selectButton' : 'offerSelection_offer_selectButton'}
        testID={buildTestId('offerSelection_offer_selectButton')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: spacing[2],
    marginBottom: spacing[7],
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formattedPrice: {
    marginLeft: spacing[4],
    width: 82,
    textAlign: 'right',
  },
  shopName: {
    lineHeight: 24,
  },
  address: {
    marginTop: spacing[1],
  },
  contentContainer: {
    paddingBottom: spacing[5],
  },
  goToSearchButtonChildrenContainerStyle: { flex: 1 },
})
