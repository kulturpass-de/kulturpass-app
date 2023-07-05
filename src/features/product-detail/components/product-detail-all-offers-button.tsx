import React from 'react'
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button } from '../../../components/button/button'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { buildTestId } from '../../../services/test-id/test-id'
import { spacing } from '../../../theme/spacing'
import { useFormattedPrice } from '../../../utils/price/hooks/use-formatted-price'
import { isPriceWithValue } from '../../../utils/price/utils'

type ProductDetailAllOffersButtonProps = {
  offers: Offer[]
  onPress: () => void
}

export const ProductDetailAllOffersButton: React.FC<ProductDetailAllOffersButtonProps> = ({ offers, onPress }) => {
  const lowestPrice = useMemo(() => {
    const prices = offers.map(offer => offer.price).filter(isPriceWithValue)
    prices.sort((a, b) => a.value - b.value)
    return prices.find(() => true)
  }, [offers])

  const formattedPrice = useFormattedPrice(lowestPrice)

  if (!formattedPrice) {
    return null
  }

  return (
    <View style={styles.margin}>
      <Button
        testID={buildTestId('productDetail_allOffers_button')}
        variant="tertiary"
        widthOption="content"
        modifier="small"
        i18nKey="productDetail_allOffers_button"
        i18nParams={{ price: formattedPrice }}
        iconSource="ArrowForward"
        onPress={onPress}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  margin: {
    marginTop: spacing[4],
    marginLeft: spacing[8],
  },
})
