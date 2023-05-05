import React, { useCallback } from 'react'
import { FlatList, StyleSheet, View, ListRenderItem } from 'react-native'

import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { Offer } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { OfferSelectionHeader } from '../components/offer-selection-header'
import { OfferSelectionListItem } from '../components/offer-selection-list-item'
import { OfferWithId } from '../types/product-detail'
import { isOfferWithId } from '../utils'

export type OfferSelectionScreenProps = {
  offers: Offer[]
  productImageUrl?: string
  onClose: () => void
  onBack: () => void
  selectOffer: (offerId: Offer['id']) => void
}

export const OfferSelectionScreen: React.FC<OfferSelectionScreenProps> = ({
  offers,
  onClose,
  onBack,
  selectOffer,
  productImageUrl,
}) => {
  const { buildTestId } = useTestIdBuilder()

  const renderOfferSelectionListItem: ListRenderItem<Offer> = useCallback(
    ({ item }) => <OfferSelectionListItem offer={item} onPress={selectOffer} />,
    [selectOffer],
  )

  const keyExtractor = useCallback((item: OfferWithId) => item.id, [])

  return (
    <ModalScreen testID={buildTestId('offerSelection')}>
      <View style={styles.scrollContainer}>
        <OfferSelectionHeader imageUrl={productImageUrl} onClose={onClose} onBack={onBack} />
        <FlatList
          style={styles.container}
          ListHeaderComponent={
            <TranslatedText
              i18nKey="offerSelection_title"
              textStyleOverrides={styles.title}
              testID={buildTestId('offerSelection_title')}
              textStyle="HeadlineH4Extrabold"
            />
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
    paddingBottom: spacing[6],
    marginTop: 18,
    color: colors.moonDarkest,
  },
  container: {
    paddingHorizontal: spacing[5],
  },
  scrollContainer: {
    height: '100%',
  },
})
