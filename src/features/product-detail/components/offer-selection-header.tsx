import React from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { HITSLOP } from '../../../theme/constants'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'

type OfferSelectionHeaderProps = {
  imageUrl?: string
  onClose: () => void
  onBack: () => void
}

export const OfferSelectionHeader: React.FC<OfferSelectionHeaderProps> = ({ imageUrl, onBack, onClose }) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { buildTestId } = useTestIdBuilder()

  return (
    <View style={styles.container}>
      <FastImage
        testID={buildTestId('offerSelection_header_image')}
        accessibilityLabel={t('offerSelection_header_image')}
        resizeMode={FastImage.resizeMode.cover}
        style={[styles.image, { backgroundColor: colors.secondaryBackground }]}
        source={{ uri: imageUrl }}
      />
      <View style={[styles.overlay, { backgroundColor: colors.secondaryBackground }]} />
      <View style={styles.buttonContainer}>
        <Pressable
          hitSlop={HITSLOP}
          testID={buildTestId('offerSelection_header_closeButton')}
          accessibilityRole="button"
          accessibilityLabel={t('offerSelection_header_closeButton')}
          onPress={onBack}>
          <View style={[styles.button, { backgroundColor: colors.secondaryBackground }]}>
            <SvgImage type="arrow-back" width={24} height={24} />
          </View>
        </Pressable>
        <Pressable
          hitSlop={HITSLOP}
          testID={buildTestId('offerSelection_header_backButton')}
          accessibilityRole="button"
          accessibilityLabel={t('offerSelection_header_backButton')}
          onPress={onClose}>
          <View style={[styles.button, { backgroundColor: colors.secondaryBackground }]}>
            <SvgImage type="close" width={24} height={24} />
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
    opacity: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
