import React from 'react'
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { Price } from '../../../services/api/types/commerce/api-types'
import { DELIVERY_SCENARIO_IN_APP_VOUCHER } from '../../../services/api/types/commerce/commerce-get-reservations'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useTextStyles } from '../../../theme/hooks/use-text-styles'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { toTransparentColor } from '../../../theme/utils'
import { useFormattedPrice } from '../../../utils/price/hooks/use-formatted-price'
import { ReservationListStatusText } from './reservation-list-status-text'

type ReservationsListItemProps = {
  onPress: () => void
  productName?: string
  imageUrl?: string
  price?: Price
  shopName?: string
  completed: boolean
  status?: string
  deliveryScenario?: string
  fulfillmentOption?: string
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
  fulfillmentOption,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()
  const { t } = useTranslation()
  const formattedPrice = useFormattedPrice(price)
  const [textStyles] = useTextStyles()

  return (
    <Pressable testID={buildTestId('reservations_listItem_button')} accessibilityRole="button" onPress={onPress}>
      {/* Do NOT remove this wrapper and it's testID,
          otherwise the views contained testIDs will not be found on iOS (bug) */}
      <View testID={buildTestId('reservations_listItem_inner')}>
        <View style={[styles.shadow, { backgroundColor: toTransparentColor(colors.boxShadow, 0.7, completed) }]} />
        <View style={[styles.container, { backgroundColor: colors.secondaryBackground }]}>
          <FastImage
            testID={buildTestId('reservations_listItem_image')}
            accessibilityLabel={t('reservations_listItem_image')}
            resizeMode={FastImage.resizeMode.cover}
            style={[styles.image, { backgroundColor: colors.secondaryBackground }]}
            source={{ uri: imageUrl }}
          />
          <View style={styles.contentContainer}>
            <View style={styles.topContainer}>
              <Text
                testID={buildTestId('reservations_listItem_productName')}
                numberOfLines={2}
                accessible
                ellipsizeMode="tail"
                style={[textStyles.BodySmallBold, styles.text, { color: colors.labelColor }]}>
                {productName ?? ''}
              </Text>
            </View>
            <View style={styles.middleContainer}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                accessible
                testID={buildTestId('reservations_listItem_shopName')}
                style={[textStyles.CaptionSemibold, styles.text, { color: colors.labelColor }]}>
                {shopName ?? ''}
              </Text>
            </View>
            <View style={styles.bottomContainer}>
              {status ? (
                <ReservationListStatusText
                  status={status}
                  deliveryScenario={
                    fulfillmentOption === 'REDEMPTION_CODE' || fulfillmentOption === 'VENDOR_CODE'
                      ? DELIVERY_SCENARIO_IN_APP_VOUCHER
                      : deliveryScenario
                  }
                />
              ) : (
                <View />
              )}
              {formattedPrice ? (
                <Text
                  testID={buildTestId('reservations_listItem_price')}
                  numberOfLines={1}
                  accessible
                  style={[textStyles.BodyExtrabold, { color: colors.labelColor }]}>
                  {formattedPrice}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
        <SvgImage width={20} height={5} type="cutout-top" preserveAspectRatio="xMaxYMax" style={styles.cutoutTop} />
        <SvgImage
          width={20}
          height={8}
          type="cutout-bottom"
          preserveAspectRatio="xMaxYMax"
          color={toTransparentColor(colors.boxShadow, 0.7, completed)}
          style={[
            styles.cutoutBottom,
            Platform.select({
              ios: styles.iosOffset,
              android: styles.androidOffset,
            }),
          ]}
        />
      </View>
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
  container: {
    minHeight: 124,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    zIndex: 100,
  },
  shadow: {
    position: 'absolute',
    top: 3,
    left: 3,
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
    minHeight: 42,
    paddingTop: spacing[0],
  },
  middleContainer: {
    paddingTop: 5.5,
    minHeight: 37.5,
  },
  bottomContainer: {
    minHeight: 27,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: spacing[0],
  },
  text: {
    flexWrap: 'wrap',
    textAlignVertical: 'top',
  },
  image: {
    height: '100%',
    width: 72,
  },
})
