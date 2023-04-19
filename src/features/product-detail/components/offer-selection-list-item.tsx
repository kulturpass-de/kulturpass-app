import React, { useCallback, useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from '../../../components/button/button'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { useFormattedPrice } from '../../../utils/price/hooks/use-formatted-price'

type OfferSelectionListItemProps = {
  offer: Offer
  onPress: (offerId: Offer['id']) => void
}

export const OfferSelectionListItem: React.FC<OfferSelectionListItemProps> = ({ offer, onPress }) => {
  const { t } = useTranslation()
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
      <View style={styles.titleContainer}>
        <Text
          testID={buildTestId('offerSelection_offer_shopName')}
          style={[textStyles.SubtitleExtrabold, { color: colors.basicBlack }]}>
          {offer.shopName}
        </Text>
        {formattedPrice ? (
          <Text
            testID={buildTestId('offerSelection_offer_price')}
            style={[textStyles.SubtitleBlack, { color: colors.basicBlack }]}>
            {formattedPrice}
          </Text>
        ) : null}
      </View>
      <Text testID={buildTestId('offerSelection_offer_address')} style={[textStyles.BodyRegular, styles.address]}>
        {addressText}
      </Text>
      <Button
        onPress={onButtonPress}
        variant="secondary"
        i18nKey="offerSelection_offer_selectButton"
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
  address: {
    marginTop: spacing[1],
    marginBottom: 18,
    color: colors.moonDarkest,
  },
})
