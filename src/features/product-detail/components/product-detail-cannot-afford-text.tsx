import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { Price } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { useFormattedPrice } from '../../../utils/price/hooks/use-formatted-price'

type ProductDetailCannotAffordTextProps = {
  productIsVoucher: boolean
  availableBalance?: Price
}

export const ProductDetailCannotAffordText: React.FC<ProductDetailCannotAffordTextProps> = ({
  productIsVoucher,
  availableBalance,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()

  const availableBalanceFormatted = useFormattedPrice(availableBalance)

  return (
    <View style={styles.cannotAffordContainer}>
      <TranslatedText
        textStyle="CaptionSemibold"
        textStyleOverrides={[styles.discount, { color: colors.labelColor }]}
        testID={buildTestId('productDetail_footer_cannot_afford_text')}
        i18nKey="productDetail_footer_cannot_afford"
        i18nParams={{ availableBalance: availableBalanceFormatted }}
        customComponents={{
          mark: (
            <Text
              style={[
                productIsVoucher
                  ? {
                      color: colors.emphasizedPriceVoucherColor,
                      backgroundColor: colors.emphasizedPriceVoucherBackground,
                    }
                  : { color: colors.emphasizedPriceColor, backgroundColor: colors.emphasizedPriceBackground },
                styles.discountAvailableBalance,
              ]}
            />
          ),
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  cannotAffordContainer: {
    flex: 1,
    paddingRight: spacing[6],
  },
  discount: {
    lineHeight: 19,
  },
  discountAvailableBalance: {
    lineHeight: 19,
    fontWeight: '700',
  },
})
