import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { GetProductDetailParams } from '../../../services/api/types'
import { getCurrentUserLocation } from '../../../services/location/redux/location-selectors'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { useRequestLocationPopup } from '../../location-sharing/hooks/use-location-popup'
import { Chip } from '../components/chip'
import { LocationSection } from '../components/offer-selection-filter/location-section'
import { PostalCodeSection } from '../components/offer-selection-filter/postal-code-section'
import { OfferSelectionHeader } from '../components/offer-selection-header'

export type OfferSelectionFilterScreenProps = {
  defaultLocationProvider?: GetProductDetailParams['location']
  productImageUrl?: string
  onClose: () => void
  onBack: () => void
  onSubmitLocation: () => void
  onSubmitPostalCode: (postalCode: string) => void
}

export const OfferSelectionFilterScreen: React.FC<OfferSelectionFilterScreenProps> = ({
  defaultLocationProvider,
  onClose,
  onBack,
  productImageUrl,
  onSubmitLocation,
  onSubmitPostalCode,
}) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()
  const currentLocationAvailable = useSelector(getCurrentUserLocation) !== undefined

  const [selected, setSelected] = useState<'location' | 'postalCode'>(defaultLocationProvider?.provider ?? 'postalCode')

  const onLocationPopupFinished = useCallback((isGranted: boolean) => {
    if (isGranted) {
      setSelected('location')
    }
  }, [])

  const openRequestLocationPopup = useRequestLocationPopup(onLocationPopupFinished)

  const onSelectLocation = useCallback(() => {
    if (!currentLocationAvailable) {
      openRequestLocationPopup()
    } else {
      setSelected('location')
    }
  }, [currentLocationAvailable, openRequestLocationPopup])

  const onSelectPostalCode = useCallback(() => {
    setSelected('postalCode')
  }, [])

  return (
    <ModalScreen testID={buildTestId('offerSelection')}>
      <OfferSelectionHeader imageUrl={productImageUrl} onClose={onClose} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TranslatedText
          i18nKey="offerSelectionFilter_title"
          textStyleOverrides={[styles.title, { color: colors.labelColor }]}
          testID={buildTestId('offerSelectionFilter_title')}
          textStyle="HeadlineH4Extrabold"
        />
        <View style={[styles.chipContainer, { columnGap: spacing[3] }]}>
          <Chip
            i18nKey="offerSelectionFilter_location"
            active={selected === 'location'}
            onPress={onSelectLocation}
            accessible
            accessibilityRole="tab"
            accessibilityState={{ selected: selected === 'location' }}
            accessibilityLabel={t('offerSelectionFilter_tab_location')}
          />
          <Chip
            i18nKey="offerSelectionFilter_postalCode"
            active={selected === 'postalCode'}
            onPress={onSelectPostalCode}
            accessible
            accessibilityRole="tab"
            accessibilityState={{ selected: selected === 'postalCode' }}
            accessibilityLabel={t('offerSelectionFilter_tab_postalCode')}
          />
        </View>
        {selected === 'location' && <LocationSection onSubmit={onSubmitLocation} />}
        {selected === 'postalCode' && <PostalCodeSection onSubmit={onSubmitPostalCode} />}
      </ScrollView>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
  },
  title: {
    marginTop: spacing[7],
    marginBottom: spacing[6],
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
  },
})
