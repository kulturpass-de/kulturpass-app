import React, { useMemo } from 'react'
import { tryAgainButtonColors as tryAgainButtonColorsDark } from '../../theme/dark/color-mappings'
import { useTheme } from '../../theme/hooks/use-theme'
import { tryAgainButtonColors as tryAgainButtonColorsLight } from '../../theme/light/color-mappings'
import { ButtonColors, TryAgainButtonColors } from '../../theme/types'
import { Button, ButtonProps } from '../button/button'
import { SvgImageProps } from '../svg-image/svg-image'

export type TryAgainButtonProps = Omit<ButtonProps, 'buttonVariantStyleOverrides' | 'variant' | 'icon'> & {
  // Used to update random values
  randomTrigger: any
}

const ICONS: Array<SvgImageProps['type']> = ['cube-one', 'cube-two', 'cube-three', 'cube-four', 'cube-five', 'cube-six']

export const TryAgainButton: React.FC<TryAgainButtonProps> = props => {
  const { colorScheme } = useTheme()

  const tryAgainButtonColors: TryAgainButtonColors = useMemo(() => {
    if (colorScheme === 'dark') {
      return tryAgainButtonColorsDark
    } else {
      return tryAgainButtonColorsLight
    }
  }, [colorScheme])

  const buttonColorOverrides: ButtonColors = useMemo(() => {
    const randomNumber = Math.round(Math.random() * (tryAgainButtonColors.length - 1))
    return tryAgainButtonColors[randomNumber]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.randomTrigger, tryAgainButtonColors])

  const icon = useMemo(() => {
    const randomNumber = Math.round(Math.random() * (ICONS.length - 1))
    return ICONS[randomNumber]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.randomTrigger])

  return <Button buttonColorOverrides={buttonColorOverrides} variant="tertiary" iconSource={icon} {...props} />
}
