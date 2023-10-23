import React, { useCallback, useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from '../../../components/button/button'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { useFormattedPrice } from '../../../utils/price/hooks/use-formatted-price'

type OfferSelectionListItemProps = {
  offer: Offer
  isVoucher: boolean
  onPress: (offerId: Offer['id']) => void
}

export const OfferSelectionListItem: React.FC<OfferSelectionListItemProps> = ({ offer, isVoucher, onPress }) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { buildTestId } = useTestIdBuilder()

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

  return (
    <View style={styles.container}>
      <View accessible>
        <View style={styles.titleContainer}>
          <Text
            testID={buildTestId('offerSelection_offer_shopName')}
            style={[textStyles.SubtitleExtrabold, styles.shopName, { color: colors.labelColor }]}>
            {offer.shopName}
          </Text>
          {formattedPrice ? (
            <Text
              testID={buildTestId('offerSelection_offer_price')}
              style={[textStyles.SubtitleBlack, { color: colors.labelColor }]}>
              {formattedPrice}
            </Text>
          ) : null}
        </View>
        <Text
          testID={buildTestId('offerSelection_offer_address')}
          style={[textStyles.BodyRegular, styles.address, { color: colors.labelColor }]}>
          {addressText}
        </Text>
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
  shopName: {
    flex: 1,
  },
  address: {
    marginTop: spacing[1],
    marginBottom: 18,
  },
})
