import React, { PropsWithChildren } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { SvgImage, SvgImageProps } from '../../../../components/svg-image/svg-image'
import { TranslatedText } from '../../../../components/translated-text/translated-text'
import { AvailableTranslations } from '../../../../components/translated-text/types'
import { TestId } from '../../../../services/test-id/test-id'
import { useTheme } from '../../../../theme/hooks/use-theme'
import { spacing } from '../../../../theme/spacing'

export type ProductDetailSectionProps = PropsWithChildren<{
  testID: TestId
  iconSource: SvgImageProps['type']
  sectionCaptioni18nKey: AvailableTranslations
  style?: StyleProp<ViewStyle>
}>

export const ProductDetailSection: React.FC<ProductDetailSectionProps> = ({
  children,
  testID,
  iconSource,
  sectionCaptioni18nKey,
  style,
}) => {
  const { colors } = useTheme()
  return (
    <View style={[styles.section, style]}>
      <SvgImage type={iconSource} width={24} height={24} />
      <View style={styles.content}>
        <TranslatedText
          i18nKey={sectionCaptioni18nKey}
          testID={testID}
          textStyle="CaptionSemibold"
          textStyleOverrides={{ color: colors.labelColor }}
        />
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    flexDirection: 'row',
    paddingTop: spacing[6],
  },
  content: {
    flexDirection: 'column',
    paddingLeft: spacing[5],
    flex: 1,
  },
})
