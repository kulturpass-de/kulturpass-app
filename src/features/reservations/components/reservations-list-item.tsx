import React from 'react'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Price } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { useFormattedPrice } from '../../../utils/price/hooks/use-formatted-price'
import { ReservationListStatusText } from './reservation-list-status-text'
import { default as CutoutTop } from './cutout-top.svg'
import { default as CutoutBottom } from './cutout-bottom.svg'

type ReservationsListItemProps = {
  onPress: () => void
  productName?: string
  imageUrl?: string
  price?: Price
  shopName?: string
  completed: boolean
  status?: string
  deliveryScenario?: string
}

export const ReservationsListItem: React.FC<ReservationsListItemProps> = ({
  onPress,
  productName,
  imageUrl,
  price,
  shopName,
  completed,
  status,
  deliveryScenario,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const { t } = useTranslation()
  const formattedPrice = useFormattedPrice(price)

  return (
    <Pressable
      style={completed ? styles.completed : undefined}
      testID={buildTestId('reservations_listItem_button')}
      onPress={onPress}>
      <View style={styles.shadow} />
      <View style={styles.container}>
        <FastImage
          testID={buildTestId('reservations_listItem_image')}
          accessibilityLabel={t('reservations_listItem_image')}
          resizeMode={FastImage.resizeMode.cover}
          style={styles.image}
          source={{ uri: imageUrl }}
          defaultSource={require('./dummy-placeholder.png')}
        />
        <View style={styles.contentContainer}>
          <View style={styles.topContainer}>
            <Text
              testID={buildTestId('reservations_listItem_productName')}
              numberOfLines={2}
              accessible
              ellipsizeMode="tail"
              style={[textStyles.BodySmallBold, styles.text]}>
              {productName ?? ''}
            </Text>
          </View>
          <View style={styles.middleContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              accessible
              testID={buildTestId('reservations_listItem_shopName')}
              style={[textStyles.CaptionSemibold, styles.text]}>
              {shopName ?? ''}
            </Text>
          </View>
          <View style={styles.bottomContainer}>
            {status ? <ReservationListStatusText status={status} deliveryScenario={deliveryScenario} /> : <View />}
            {formattedPrice ? (
              <Text
                testID={buildTestId('reservations_listItem_price')}
                numberOfLines={1}
                accessible
                style={[textStyles.BodyExtrabold, { color: colors.moonDarkest }]}>
                {formattedPrice}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
      <CutoutTop preserveAspectRatio="xMaxYMax" style={styles.cutoutTop} />
      <CutoutBottom
        preserveAspectRatio="xMaxYMax"
        style={[
          styles.cutoutBottom,
          Platform.select({
            ios: styles.iosOffset,
            android: styles.androidOffset,
          }),
        ]}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  cutoutTop: {
    position: 'absolute',
    right: 58,
    top: 0,
    zIndex: 150,
  },
  cutoutBottom: {
    position: 'absolute',
    right: 58,
    zIndex: 150,
  },
  iosOffset: {
    bottom: -3,
  },
  androidOffset: {
    bottom: -3.05,
  },
  completed: {
    opacity: 0.75,
  },
  container: {
    height: 124,
    borderRadius: 16,
    flexDirection: 'row',
    backgroundColor: colors.basicWhite,
    overflow: 'hidden',
    zIndex: 100,
  },
  shadow: {
    position: 'absolute',
    top: 3,
    left: 3,
    backgroundColor: colors.basicBlack,
    borderRadius: 16,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  contentContainer: {
    flex: 1,
    flexGrow: 1,
    paddingTop: spacing[3],
    paddingBottom: spacing[4],
    paddingLeft: spacing[4],
    paddingRight: spacing[3],
    flexDirection: 'column',
  },
  topContainer: {
    flexDirection: 'row',
    height: 42,
    paddingTop: spacing[0],
  },
  middleContainer: {
    paddingTop: 5.5,
    height: 37.5,
  },
  bottomContainer: {
    height: 27,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing[0],
  },
  text: {
    flexWrap: 'wrap',
    textAlignVertical: 'top',
    color: colors.moonDarkest,
  },
  image: {
    height: '100%',
    width: 72,
  },
})
