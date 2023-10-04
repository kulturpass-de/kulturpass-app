import React, { useCallback, useMemo } from 'react'
import { FlatList, StyleSheet, View, ListRenderItem, Pressable } from 'react-native'
import { Divider } from '../../components/divider/divider'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { SvgImage } from '../../components/svg-image/svg-image'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { OfferSelectionHeader } from '../../features/product-detail/components/offer-selection-header'
import { OfferSelectionListItem } from '../../features/product-detail/components/offer-selection-list-item'
import { OfferSelectionToken } from '../../features/product-detail/components/offer-selection/offer-selection-token'
import { OfferWithId, ProductDetail } from '../../features/product-detail/types/product-detail'
import { isOfferWithId, isVoucher } from '../../features/product-detail/utils'
import { GetProductDetailParams } from '../../services/api/types'
import { Offer } from '../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { HITSLOP } from '../../theme/constants'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'

export type OfferSelectionScreenProps = {
  offers: Offer[]
  fulfillmentOption: ProductDetail['fulfillmentOption']
  productImageUrl?: string
  onClose: () => void
  onBack: () => void
  selectOffer: (offerId: Offer['id']) => void
  onPressFilter: () => void
  offersByLocation?: GetProductDetailParams['location']
}

export const OfferSelectionScreen: React.FC<OfferSelectionScreenProps> = ({
  offers,
  onClose,
  onBack,
  selectOffer,
  fulfillmentOption,
  productImageUrl,
  onPressFilter,
  offersByLocation,
}) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()

  const productIsVoucher = useMemo(() => isVoucher(fulfillmentOption), [fulfillmentOption])

  const renderOfferSelectionListItem: ListRenderItem<Offer> = useCallback(
    ({ item }) => <OfferSelectionListItem offer={item} isVoucher={productIsVoucher} onPress={selectOffer} />,
    [productIsVoucher, selectOffer],
  )

  const keyExtractor = useCallback((item: OfferWithId) => item.id, [])

  return (
    <ModalScreen testID={buildTestId('offerSelection')}>
      <View style={styles.scrollContainer}>
        <OfferSelectionHeader imageUrl={productImageUrl} onClose={onClose} onBack={onBack} />
        <FlatList
          style={styles.container}
          ListHeaderComponent={
            <View>
              <TranslatedText
                i18nKey={productIsVoucher ? 'offerSelection_voucher_title' : 'offerSelection_title'}
                textStyleOverrides={[styles.title, { color: colors.labelColor }]}
                testID={buildTestId('offerSelection_title')}
                textStyle="HeadlineH4Extrabold"
              />
              <Pressable
                hitSlop={HITSLOP}
                onPress={onPressFilter}
                accessibilityRole="button"
                accessibilityLabel={t(`offerSelection_edit_${offersByLocation?.provider ?? 'location'}`)}>
                {({ pressed }) => (
                  <View style={styles.filterBar}>
                    {offersByLocation?.provider === 'location' && (
                      <OfferSelectionToken i18nKey="offerSelection_filter_location" />
                    )}
                    {offersByLocation?.provider === 'postalCode' && (
                      <OfferSelectionToken
                        i18nKey="offerSelection_filter_postalCode"
                        i18nParams={{ postalCode: offersByLocation.postalCode }}
                      />
                    )}
                    {offersByLocation?.provider === 'city' && (
                      <OfferSelectionToken customText={offersByLocation.location.name} />
                    )}
                    {offersByLocation === undefined && (
                      <OfferSelectionToken i18nKey="offerSelection_filter_none" disabled />
                    )}
                    <View>
                      <SvgImage type="edit-3" width={24} height={24} style={pressed ? styles.pressed : null} />
                    </View>
                  </View>
                )}
              </Pressable>
              <Divider marginTop={spacing[0]} />
            </View>
          }
          data={offers.filter(isOfferWithId)}
          renderItem={renderOfferSelectionListItem}
          keyExtractor={keyExtractor}
        />
      </View>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  title: {
    marginTop: spacing[5],
  },
  container: {
    paddingHorizontal: spacing[5],
  },
  scrollContainer: {
    height: '100%',
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing[5],
  },
  pressed: {
    opacity: 0.8,
  },
})
