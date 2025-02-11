import React from 'react'
import { Image, Platform, StyleSheet, View } from 'react-native'
import { CircleIconButton } from '../../../components/circle-icon-button/circle-icon-button'
import { addTestIdModifier, buildTestId } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import Backdrop from '../assets/mobility-offers-details-bg.svg'

export type MobilityOffersHeaderProps = {
  onClose: () => void
  showBackDrop?: boolean
  showNavBarImage?: boolean
}

export const MobilityOffersHeader: React.FC<MobilityOffersHeaderProps> = ({
  onClose,
  showBackDrop = false,
  showNavBarImage = false,
}) => {
  const testID = buildTestId('mobile_offers_product_header')
  const { colors } = useTheme()

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.secondaryBackground }]} testID={testID}>
      <View
        style={[styles.container, { backgroundColor: colors.secondaryBackground }]}
        testID={addTestIdModifier(testID, 'image')}>
        {showBackDrop && (
          <View style={styles.backdropContainer}>
            <Backdrop style={styles.backdropSmall} />
          </View>
        )}

        {showNavBarImage && (
          <Image
            source={require('../../../theme/common-images/ft-header-background-image.png')}
            style={styles.imageStyle}
            resizeMode="cover"
          />
        )}
      </View>
      <View testID={addTestIdModifier(testID, 'close_button')} style={styles.headerContainer}>
        <View style={styles.buttonContainer}>
          <CircleIconButton
            accessibilityLabelI18nKey="mobility_offers_ft_product_detail_code_header_close_button"
            testID={addTestIdModifier(testID, 'close_button')}
            iconSource="close"
            onPress={onClose}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    width: '100%',
    minHeight: 56,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    minHeight: 56,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 300,
  },
  imageStyle: {
    alignSelf: 'center',
    maxWidth: '100%',
  },
  backdropContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  backdropSmall: {
    aspectRatio: Platform.OS === 'android' ? 270 / 300 : 290 / 300,
  },
  buttonContainer: {
    gap: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: spacing[2],
  },
})
