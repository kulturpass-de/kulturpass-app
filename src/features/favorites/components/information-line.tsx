import React from 'react'
import { Text } from 'react-native'
import { Product } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useTextStyles } from '../../../theme/hooks/use-text-styles'
import { useTheme } from '../../../theme/hooks/use-theme'

type InformationLineProps = Pick<Product, 'venueName' | 'itemType' | 'shopDistance'> & {
  shopInformation?: string
  shopName?: string
}

export const InformationLine: React.FC<InformationLineProps> = ({ venueName, itemType, shopName, shopDistance }) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()
  const [textStyles] = useTextStyles()

  const styles = [textStyles.BodySmallRegular, { color: colors.labelColor }]

  const shopInformation = React.useMemo(() => {
    if (shopName !== undefined) {
      if (shopDistance !== undefined) {
        return `${t('favorites_item_distance', { distance: shopDistance })} | ${shopName}`
      } else {
        return shopName
      }
    }
  }, [shopName, shopDistance, t])

  if (itemType === 'WorkshopProduct' && venueName !== undefined) {
    return (
      <Text numberOfLines={3} testID={buildTestId('favorites_item_venue')} style={styles}>
        {venueName}
      </Text>
    )
  }

  if (shopInformation !== undefined) {
    return (
      <Text numberOfLines={3} testID={buildTestId('favorites_item_shopInformation')} style={styles}>
        {shopInformation}
      </Text>
    )
  }

  return (
    <Text numberOfLines={1} testID={buildTestId('favorites_item_no_offers')} style={styles}>
      {t('favorites_item_no_offers')}
    </Text>
  )
}
