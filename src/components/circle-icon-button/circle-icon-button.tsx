import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { useTranslation } from '../../services/translation/translation'
import { HITSLOP } from '../../theme/constants'
import { useTheme } from '../../theme/hooks/use-theme'
import { SvgImage, SvgImageProps } from '../svg-image/svg-image'
import { AvailableTranslations } from '../translated-text/types'

export type CircleIconButtonProps = {
  iconSource: SvgImageProps['type']
  testID: string
  accessibilityLabelI18nKey: AvailableTranslations
  onPress: () => void
}

export const CircleIconButton: React.FC<CircleIconButtonProps> = ({
  iconSource,
  testID,
  accessibilityLabelI18nKey,
  onPress,
}) => {
  const { t } = useTranslation()
  const { colors } = useTheme()

  return (
    <Pressable
      hitSlop={HITSLOP}
      style={[styles.button, { backgroundColor: colors.secondaryBackground }]}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={t(accessibilityLabelI18nKey)}
      onPress={onPress}>
      <SvgImage type={iconSource} width={24} height={24} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    height: 42,
    width: 42,
    opacity: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
