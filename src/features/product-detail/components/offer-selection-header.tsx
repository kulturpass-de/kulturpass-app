import React from 'react'
import { StyleSheet, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { CircleIconButton } from '../../../components/circle-icon-button/circle-icon-button'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
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
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()

  const testID = buildTestId('offerSelection_header')

  return (
    <View style={styles.container}>
      <FastImage
        testID={addTestIdModifier(testID, 'image')}
        accessibilityLabel={t('offerSelection_header_image')}
        resizeMode={FastImage.resizeMode.cover}
        style={[styles.image, { backgroundColor: colors.secondaryBackground }]}
        source={{ uri: imageUrl }}
      />
      <View style={[styles.overlay, { backgroundColor: colors.secondaryBackground }]} />
      <View style={styles.buttonContainer}>
        <CircleIconButton
          testID={addTestIdModifier(testID, 'backButton')}
          accessibilityLabelI18nKey="offerSelection_header_backButton"
          onPress={onBack}
          iconSource="arrow-back"
        />
        <CircleIconButton
          testID={addTestIdModifier(testID, 'closeButton')}
          accessibilityLabelI18nKey="offerSelection_header_closeButton"
          onPress={onClose}
          iconSource="close"
        />
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
})
