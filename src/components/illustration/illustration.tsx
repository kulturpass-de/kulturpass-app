import React, { useMemo } from 'react'
import { Image, ImageSourcePropType, ImageStyle, StyleProp, View } from 'react-native'
import { useTranslation } from '../../services/translation/translation'
import { requireIllustrationImage as requireIllustrationImageDark } from '../../theme/dark/illustrations'
import { useTheme } from '../../theme/hooks/use-theme'
import { requireIllustrationImage as requireIllustrationImageLight } from '../../theme/light/illustrations'
import { AvailableTranslations } from '../translated-text/types'

export type IllustrationType =
  | 'onboarding'
  | 'localisation-consent'
  | 'data-privacy'
  | 'verify-mail'
  | 'registration-finished'
  | 'eid'
  | 'eid-card-positioning-ios'
  | 'eid-card-positioning-android'
  | 'eid-nfc-disabled'
  | 'success'
  | 'budget-received'
  | 'empty-state-reservations'
  | 'empty-state-reservations-closed'
  | 'favorites-empty-state'
  | 'stop-sign'
  | 'delete-account'
  | 'no-network'
  | 'location-sharing'
  | 'notification-permission'

export type IllustrationProps = {
  type: IllustrationType
  i18nKey: AvailableTranslations
  testID: string
  style?: StyleProp<ImageStyle>
}

export const Illustration: React.FC<IllustrationProps> = ({
  type,
  i18nKey,
  testID,
  style = {
    width: '100%',
  },
}) => {
  const { colorScheme } = useTheme()
  const { t } = useTranslation()

  const source: ImageSourcePropType = useMemo(() => {
    if (colorScheme === 'dark') {
      return requireIllustrationImageDark(type)
    } else {
      return requireIllustrationImageLight(type)
    }
  }, [colorScheme, type])

  return (
    <View testID={testID} accessible={true} accessibilityRole="image" accessibilityLabel={t(i18nKey)} style={style}>
      <Image source={source} style={style} />
    </View>
  )
}
