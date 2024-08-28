import { camelCase, startCase } from 'lodash'
import React, { useMemo } from 'react'
import { Dimensions } from 'react-native'
import { SvgProps } from 'react-native-svg'
import { useTheme } from '../../theme/hooks/use-theme'
import * as SVGs from './svgs'
import * as DarkSVGs from './svgs/dark'
import * as LightSVGs from './svgs/light'

const svgKeys = Object.keys(SVGs)

const darkSVGKeys = Object.keys(DarkSVGs)
const lightSVGKeys = Object.keys(LightSVGs)

type CommonSvgComponentKeyType = keyof typeof SVGs

type LightSvgComponentKeyType = keyof typeof LightSVGs
type DarkSvgComponentKeyType = keyof typeof DarkSVGs

const stringIsCommonSvgComponentKeyType = (svgKey: string): svgKey is CommonSvgComponentKeyType =>
  svgKeys.includes(svgKey)

const stringIsLightSvgComponentKeyType = (svgKey: string): svgKey is LightSvgComponentKeyType =>
  lightSVGKeys.includes(svgKey)
const stringIsDarkSvgComponentKeyType = (svgKey: string): svgKey is DarkSvgComponentKeyType =>
  darkSVGKeys.includes(svgKey)

type CamelToKebabCase<A extends string> = A extends `${infer B}${infer C}`
  ? `${B extends Capitalize<B> ? '-' : ''}${Lowercase<B>}${CamelToKebabCase<C>}`
  : A

type PascalToKebabCase<S extends string> = CamelToKebabCase<Uncapitalize<S>>

export type SvgImageType = PascalToKebabCase<CommonSvgComponentKeyType>
type LightSvgImageType = PascalToKebabCase<LightSvgComponentKeyType>
type DarkSvgImageType = PascalToKebabCase<DarkSvgComponentKeyType>

export type ThemedSvgImageType = DarkSvgImageType | LightSvgImageType

export type SvgImageProps = SvgProps & {
  type: SvgImageType | ThemedSvgImageType

  /**
   * overrides screenWidthRelativeSize
   */
  width?: number

  /**
   * overrides screenWidthRelativeSize
   */
  height?: number | string

  /**
   * width and height relative [0 ... 1.0] to device screen width
   *
   * 0.5 by default
   */
  screenWidthRelativeSize?: number

  accessibilityLabel?: string
  testID?: string
}

export const SvgImage: React.FC<SvgImageProps> = ({
  type,
  width,
  height,
  screenWidthRelativeSize = 0.5,
  accessibilityLabel,
  testID,
  color,
  fill,
  style,
}) => {
  const { colorScheme } = useTheme()

  const svgProps: SvgProps = useMemo(() => {
    const screenWidth = Dimensions.get('screen').width
    const accessible = !!accessibilityLabel

    let newHeight = height

    if (newHeight === undefined || (typeof newHeight === 'number' && newHeight <= 0)) {
      newHeight = screenWidth * screenWidthRelativeSize
    }

    const ops: SvgProps = {
      width: width && width > 0 ? width : screenWidth * screenWidthRelativeSize,
      height: newHeight,
      testID,
      accessible,
      accessibilityRole: 'image',
      accessibilityLabel,
      color,
      style,
    }

    if (fill !== undefined) {
      ops.fill = fill
    }

    return ops
  }, [width, height, screenWidthRelativeSize, color, fill, accessibilityLabel, style, testID])

  const SvgComponent = useMemo(() => {
    const svgKey = startCase(camelCase(type)).replace(/ /g, '')

    let Comp = SVGs.PlaceholderRectangle

    if (colorScheme === 'light' && stringIsLightSvgComponentKeyType(svgKey)) {
      Comp = LightSVGs[svgKey]
    } else if (colorScheme === 'dark' && stringIsDarkSvgComponentKeyType(svgKey)) {
      Comp = DarkSVGs[svgKey]
    } else if (stringIsCommonSvgComponentKeyType(svgKey)) {
      Comp = SVGs[svgKey]
    }

    return <Comp {...svgProps} />
  }, [type, svgProps, colorScheme])

  return SvgComponent
}
