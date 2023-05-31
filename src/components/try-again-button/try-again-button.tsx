import React, { useMemo } from 'react'
import { colors } from '../../theme/colors'
import { IconProps } from '../icon/icon'
import { Button, ButtonProps } from '../button/button'
import { ButtonTypeStyle } from '../button/button-style'
import { spacing } from '../../theme/spacing'

export type TryAgainButtonProps = Omit<ButtonProps, 'buttonVariantStyleOverrides' | 'variant' | 'icon'> & {
  // Used to update random values
  randomTrigger: any
}

const COLORS: Array<{
  base: string
  pressed: string
  disabled: string
}> = [
  {
    base: colors.greenLight,
    pressed: colors.greenBase,
    disabled: colors.greenLightest,
  },
  {
    base: colors.secondaryLight,
    pressed: colors.secondaryBase,
    disabled: colors.secondaryLightest,
  },
  {
    base: colors.yellowLight,
    pressed: colors.yellowBase,
    disabled: colors.yellowLightest,
  },
  {
    base: colors.primaryLighter,
    pressed: colors.primaryLight,
    disabled: colors.primaryLightest,
  },
]

const ICONS: Array<IconProps['source']> = ['CubeOne', 'CubeTwo', 'CubeThree', 'CubeFour', 'CubeFive', 'CubeSix']

export const TryAgainButton: React.FC<TryAgainButtonProps> = props => {
  const buttonVariantStyleOverrides: Partial<ButtonTypeStyle> = useMemo(() => {
    const randomNumber = Math.round(Math.random() * (COLORS.length - 1))
    const randomColors = COLORS[randomNumber]
    return {
      baseContainer: {
        backgroundColor: randomColors.base,
        borderColor: colors.moonDarkest,
      },
      baseShadow: {
        position: 'absolute',
        top: 3,
        left: 3,
        backgroundColor: colors.moonDarkest,
        zIndex: 0,
        width: '100%',
        borderRadius: spacing[6],
      },
      pressedContainer: {
        backgroundColor: randomColors.pressed,
        borderColor: colors.moonDarkest,
      },
      pressedShadow: {
        backgroundColor: colors.moonDarkest,
      },
      disabledContainer: {
        backgroundColor: randomColors.disabled,
        borderColor: '#6E6E6E',
      },
      disabledShadow: {
        backgroundColor: '#6E6E6E',
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.randomTrigger])

  const icon = useMemo(() => {
    const randomNumber = Math.round(Math.random() * (ICONS.length - 1))
    return ICONS[randomNumber]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.randomTrigger])

  return (
    <Button buttonVariantStyleOverrides={buttonVariantStyleOverrides} variant="tertiary" iconSource={icon} {...props} />
  )
}
