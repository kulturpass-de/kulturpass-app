import { camelCase, startCase } from 'lodash'
import React, { useMemo } from 'react'
import { Dimensions } from 'react-native'
import { SvgProps } from 'react-native-svg'
import { useTranslation } from '../../services/translation/translation'
import { AvailableTranslations } from '../translated-text/types'
import * as SVGs from './svgs'

const svgKeys = Object.keys(SVGs)

type SvgComponentKeyType = keyof typeof SVGs

const stringIsSvgComponentKeyType = (svgKey: string): svgKey is SvgComponentKeyType => svgKeys.includes(svgKey)

type CamelToKebabCase<A extends string> = A extends `${infer B}${infer C}`
  ? `${B extends Capitalize<B> ? '-' : ''}${Lowercase<B>}${CamelToKebabCase<C>}`
  : A

type PascalToKebabCase<S extends string> = CamelToKebabCase<Uncapitalize<S>>

export type SvgImageType = PascalToKebabCase<SvgComponentKeyType>

export type SvgImageProps = SvgProps & {
  type: SvgImageType

  /**
   * overrides screenWidthRelativeSize
   */
  width?: number

  /**
   * overrides screenWidthRelativeSize
   */
  height?: number

  /**
   * width and height relative [0 ... 1.0] to device screen width
   *
   * 0.5 by default
   */
  screenWidthRelativeSize?: number

  i18nKey?: AvailableTranslations
  testID?: string
}

export const SvgImage: React.FC<SvgImageProps> = ({
  type,
  width,
  height,
  screenWidthRelativeSize = 0.5,
  i18nKey,
  testID,
  color,
  style,
}) => {
  const { t } = useTranslation()

  const svgProps: SvgProps = useMemo(() => {
    const screenWidth = Dimensions.get('screen').width
    const accessible = !!i18nKey

    return {
      width: width && width > 0 ? width : screenWidth * screenWidthRelativeSize,
      height: height && height > 0 ? height : screenWidth * screenWidthRelativeSize,
      testID,
      accessible,
      accessibilityRole: 'image',
      accessibilityLabel: accessible ? t(i18nKey!) : undefined,
      color,
      style,
    }
  }, [width, height, screenWidthRelativeSize, color, i18nKey, style, t, testID])

  const SvgComponent = useMemo(() => {
    const svgKey = startCase(camelCase(type)).replace(/ /g, '')

    let Comp = SVGs.PlaceholderRectangle

    if (stringIsSvgComponentKeyType(svgKey)) {
      Comp = SVGs[svgKey]
    }

    return <Comp {...svgProps} />
  }, [type, svgProps])

  return SvgComponent
}
