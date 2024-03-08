import Clipboard from '@react-native-clipboard/clipboard'
import React, { useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { CopyToClipboard, CopyToClipboardProps } from '../../../components/copy-to-clipboard/copy-to-clipboard'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useTextStyles } from '../../../theme/hooks/use-text-styles'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'

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

export const Address: React.FC<
  AddressProps & Pick<CopyToClipboardProps, 'accessibilityLabelI18nKey' | 'copiedAccessibilityI18nKey'>
> = ({
  name,
  city,
  postalCode,
  street,
  distance,
  showCopyToClipboard,
  baseTestId,
  accessibilityLabelI18nKey,
  copiedAccessibilityI18nKey,
  showDistance = true,
}) => {
  const { addTestIdModifier } = useTestIdBuilder()
  const { colors } = useTheme()
  const { t } = useTranslation()
  const textStyles = useTextStyles()

  const copyToClipboard = useCallback(() => {
    copyAddressToClipboard({
      name,
      city,
      street,
      postalCode,
    })
  }, [city, name, postalCode, street])

  return (
    <View style={styles.container} testID={addTestIdModifier(baseTestId, 'address')}>
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
            accessibilityLabelI18nKey={accessibilityLabelI18nKey}
            copiedAccessibilityI18nKey={copiedAccessibilityI18nKey}
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
