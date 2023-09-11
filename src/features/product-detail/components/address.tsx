import Clipboard from '@react-native-clipboard/clipboard'
import React, { useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { CopyToClipboard } from '../../../components/copy-to-clipboard/copy-to-clipboard'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'

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
    <View style={styles.container}>
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
          <CopyToClipboard
            baseTestId={baseTestId}
            copyToClipboardAccessibilityI18nKey={copyToClipboardAccessibilityI18nKey}
            onPress={copyToClipboard}
          />
        ) : null}
      </View>
      {showDistance && distance ? (
        <Text
          testID={addTestIdModifier(baseTestId, 'distance')}
          style={[textStyles.BodySmallBold, styles.distance, { color: colors.labelColor }]}>
          {t('productDetail_offer_distance', { distance })}
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flexGrow: 1,
    flex: 1,
  },
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

const copyAddressToClipboard = (address: Address) => {
  // YES, this is formatted correctly
  Clipboard.setString(`${address.name}
${address.street}
${address.postalCode} ${address.city}`)
}

type Address = {
  name?: string
  street?: string
  city?: string
  postalCode?: string
}
