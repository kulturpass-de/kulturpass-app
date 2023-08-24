import React, { useCallback } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { HITSLOP } from '../../../theme/constants'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { copyAddressToClipboard } from '../utils'

export type AddressProps = {
  name?: string
  city?: string
  postalCode?: string
  street?: string
  distance?: number | string
  showDistance?: boolean
  showCopyToClipboard: boolean
  baseTestId: string
  copyToClipboardAccessibilityI18nKey: AvailableTranslations
}

export const Address: React.FC<AddressProps> = ({
  name,
  city,
  postalCode,
  street,
  distance,
  showCopyToClipboard,
  baseTestId,
  copyToClipboardAccessibilityI18nKey,
  showDistance = true,
}) => {
  const { addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()
  const { t } = useTranslation()

  const copyToClipboard = useCallback(() => {
    copyAddressToClipboard({
      name,
      city,
      street,
      postalCode,
    })
  }, [city, name, postalCode, street])

  return (
    <>
      <View style={styles.addressSection}>
        <View style={styles.address}>
          {name ? (
            <Text
              testID={addTestIdModifier(baseTestId, 'name')}
              style={[textStyles.BodyBlack, { color: colors.labelColor }]}>
              {name}
            </Text>
          ) : null}
          {street ? (
            <Text
              testID={addTestIdModifier(baseTestId, 'street')}
              style={[textStyles.BodyRegular, { color: colors.labelColor }]}>
              {street}
            </Text>
          ) : null}
          <Text
            testID={addTestIdModifier(baseTestId, 'city')}
            style={[textStyles.BodyRegular, { color: colors.labelColor }]}>
            {postalCode} {city}
          </Text>
        </View>
        {showCopyToClipboard ? (
          <Pressable
            hitSlop={HITSLOP}
            testID={addTestIdModifier(baseTestId, 'copyToClipboard')}
            accessibilityRole="button"
            accessibilityLabel={t(copyToClipboardAccessibilityI18nKey)}
            onPress={copyToClipboard}>
            {({ pressed }) => <SvgImage type={pressed ? 'copy-clipboard' : 'clipboard'} width={24} height={24} />}
          </Pressable>
        ) : null}
      </View>
      {showDistance && distance ? (
        <Text
          testID={addTestIdModifier(baseTestId, 'distance')}
          style={[textStyles.BodySmallBold, styles.distance, { color: colors.labelColor }]}>
          {t('productDetail_offer_distance', { distance })}
        </Text>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  distance: {
    paddingTop: spacing[3],
  },
  addressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  address: {
    flexShrink: 1,
  },
})
