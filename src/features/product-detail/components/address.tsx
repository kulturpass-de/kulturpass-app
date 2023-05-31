import React, { useCallback } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { textStyles } from '../../../theme/typography'
import { spacing } from '../../../theme/spacing'
import { colors } from '../../../theme/colors'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { HITSLOP } from '../../../theme/constants'
import { copyAddressToClipboard } from '../utils'
import { Icon } from '../../../components/icon/icon'

export type AddressProps = {
  name?: string
  city?: string
  postalCode?: string
  street?: string
  distance?: number | string
  showDistance?: boolean
  showCopyToClipboard: boolean
  baseTestId: string
}

export const Address: React.FC<AddressProps> = ({
  name,
  city,
  postalCode,
  street,
  distance,
  showCopyToClipboard,
  baseTestId,
  showDistance = true,
}) => {
  const { addTestIdModifier } = useTestIdBuilder()
  const { t } = useTranslation()

  const copyToClipboard = useCallback(() => {
    copyAddressToClipboard({
      name,
      city,
      street,
      postalCode,
    })
    // TODO: show toast?
  }, [city, name, postalCode, street])

  return (
    <>
      <View style={styles.addressSection}>
        <View style={styles.address}>
          {name ? (
            <Text
              testID={addTestIdModifier(baseTestId, 'name')}
              style={[textStyles.BodyBlack, { color: colors.primaryDark }]}>
              {name}
            </Text>
          ) : null}
          {street ? (
            <Text
              testID={addTestIdModifier(baseTestId, 'street')}
              style={[textStyles.BodyRegular, { color: colors.primaryDark }]}>
              {street}
            </Text>
          ) : null}
          <Text
            testID={addTestIdModifier(baseTestId, 'city')}
            style={[textStyles.BodyRegular, { color: colors.primaryDark }]}>
            {postalCode} {city}
          </Text>
        </View>
        {showCopyToClipboard ? (
          <Pressable
            hitSlop={HITSLOP}
            testID={addTestIdModifier(baseTestId, 'copyToClipboard')}
            accessibilityRole="button"
            accessibilityLabel={t('productDetail_offer_copyToClipboard')}
            onPress={copyToClipboard}>
            <Icon source="Clipboard" width={24} height={24} />
          </Pressable>
        ) : null}
      </View>
      {showDistance && distance ? (
        <Text testID={addTestIdModifier(baseTestId, 'distance')} style={[textStyles.BodySmallBold, styles.distance]}>
          {t('productDetail_offer_distance', { distance })}
        </Text>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  distance: {
    paddingTop: spacing[3],
    color: colors.moonDarkest,
  },
  addressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  address: {
    flexGrow: 1,
  },
})
