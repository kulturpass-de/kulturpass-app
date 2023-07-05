import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Icon } from '../../../components/icon/icon'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { colors } from '../../../theme/colors'
import { HITSLOP } from '../../../theme/constants'
import { spacing } from '../../../theme/spacing'

type OfferSelectionHeaderProps = {
  imageUrl?: string
  onClose: () => void
  onBack: () => void
}

export const OfferSelectionHeader: React.FC<OfferSelectionHeaderProps> = ({ imageUrl, onBack, onClose }) => {
  const { t } = useTranslation()
  const { buildTestId } = useTestIdBuilder()

  return (
    <View style={styles.container}>
      <FastImage
        testID={buildTestId('offerSelection_header_image')}
        accessibilityLabel={t('offerSelection_header_image')}
        resizeMode={FastImage.resizeMode.cover}
        style={styles.image}
        source={{ uri: imageUrl }}
        defaultSource={require('./dummy-placeholder.png')}
      />
      <View style={styles.overlay} />
      <View style={styles.buttonContainer}>
        <Pressable
          hitSlop={HITSLOP}
          testID={buildTestId('offerSelection_header_closeButton')}
          accessibilityRole="button"
          accessibilityLabel={t('offerSelection_header_closeButton')}
          onPress={onBack}>
          <View style={styles.button}>
            <Icon source="ArrowBack" width={24} height={24} />
          </View>
        </Pressable>
        <Pressable
          hitSlop={HITSLOP}
          testID={buildTestId('offerSelection_header_backButton')}
          accessibilityRole="button"
          accessibilityLabel={t('offerSelection_header_backButton')}
          onPress={onClose}>
          <View style={styles.button}>
            <Icon source="Close" width={24} height={24} />
          </View>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  overlay: {
    position: 'absolute',
    backgroundColor: colors.basicWhite,
    opacity: 0.7,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 200,
    height: '100%',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    width: '100%',
    zIndex: 100,
  },
  buttonContainer: {
    zIndex: 300,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: spacing[2],
  },
  button: {
    borderRadius: 24,
    height: 42,
    width: 42,
    backgroundColor: colors.basicWhite,
    opacity: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
