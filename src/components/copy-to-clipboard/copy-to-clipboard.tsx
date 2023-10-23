import React from 'react'
import { Pressable, StyleProp, ViewStyle } from 'react-native'
import { AvailableTranslations } from '../../components/translated-text/types'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { HITSLOP } from '../../theme/constants'
import { SvgImage } from '../svg-image/svg-image'

export type CopyToClipboardProps = {
  baseTestId: string
  copyToClipboardAccessibilityI18nKey: AvailableTranslations
  onPress: () => void
  style?: StyleProp<ViewStyle>
}

export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  baseTestId,
  copyToClipboardAccessibilityI18nKey,
  onPress,
  style,
}) => {
  const { t } = useTranslation()
  const { addTestIdModifier } = useTestIdBuilder()

  return (
    <Pressable
      hitSlop={HITSLOP}
      testID={addTestIdModifier(baseTestId, 'copyToClipboard')}
      accessibilityRole="button"
      accessibilityLabel={t(copyToClipboardAccessibilityI18nKey)}
      style={style}
      onPress={onPress}>
      {({ pressed }) => <SvgImage type={pressed ? 'copy-clipboard' : 'clipboard'} width={24} height={24} />}
    </Pressable>
  )
}
