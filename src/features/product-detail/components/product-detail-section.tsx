import React, { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, IconProps } from '../../../components/icon/icon'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { colors } from '../../../theme/colors'
import { spacing } from '../../../theme/spacing'

export type ProductDetailSectionProps = PropsWithChildren<{
  iconSource: IconProps['source']
  sectionCaptioni18nKey: AvailableTranslations
}>

export const ProductDetailSection: React.FC<ProductDetailSectionProps> = ({
  children,
  iconSource,
  sectionCaptioni18nKey,
}) => {
  const { buildTestId } = useTestIdBuilder()
  return (
    <View style={styles.section}>
      <Icon source={iconSource} width={24} height={23} />
      <View style={styles.content}>
        <TranslatedText
          i18nKey={sectionCaptioni18nKey}
          testID={buildTestId(sectionCaptioni18nKey)}
          textStyle="CaptionSemibold"
          textStyleOverrides={{ color: colors.moonDarkest }}
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
