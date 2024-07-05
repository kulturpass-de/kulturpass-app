import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button } from '../../../components/button/button'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenFooter } from '../../../components/modal-screen/modal-screen-footer'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { ScreenContent } from '../../../components/screen/screen-content'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { Price } from '../../../services/api/types/commerce/api-types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { useFormattedPrice } from '../../../utils/price/hooks/use-formatted-price'

type BudgetVoucherSuccessScreenProps = {
  price: Price
  onDone: () => void
}

export const BudgetVoucherSuccessScreen: React.FC<BudgetVoucherSuccessScreenProps> = props => {
  const { onDone, price } = props

  const { colors } = useTheme()

  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const screenTestID = buildTestId('budget_voucher_success')

  const formattedPrice = useFormattedPrice(price)

  return (
    <ModalScreen testID={screenTestID} whiteBottom>
      <ModalScreenHeader
        titleI18nKey="budget_voucher_headline_success"
        testID={addTestIdModifier(screenTestID, 'headline')}
        onPressClose={onDone}
        onPressBack={onDone}
      />
      <ScreenContent style={styles.screenContent}>
        <View accessibilityRole="image" testID={addTestIdModifier(screenTestID, 'image')}>
          <SvgImage type="budget-voucher-success" style={styles.image} screenWidthRelativeSize={0.6} />
        </View>

        <TranslatedText
          i18nKey="budget_voucher_content_title_success"
          textStyle="HeadlineH3Extrabold"
          accessibilityRole="header"
          testID={addTestIdModifier(screenTestID, 'title')}
          textStyleOverrides={[styles.title, { color: colors.labelColor }]}
        />

        {typeof formattedPrice === 'string' ? (
          <TranslatedText
            i18nKey="budget_voucher_text_success"
            textStyle="BodyRegular"
            testID={addTestIdModifier(screenTestID, 'text')}
            i18nParams={{ amount: formattedPrice }}
            textStyleOverrides={[styles.text, { color: colors.labelColor }]}
          />
        ) : null}
      </ScreenContent>

      <ModalScreenFooter ignorePaddingWithSafeArea={false}>
        <Button
          disabled={false}
          testID={addTestIdModifier(screenTestID, 'done')}
          i18nKey="budget_voucher_done"
          onPress={onDone}
        />
      </ModalScreenFooter>
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  screenContent: {
    marginTop: spacing[6],
    paddingHorizontal: spacing[5],
    alignItems: 'center',
  },
  image: { maxWidth: 300 },
  title: { marginBottom: spacing[6], textAlign: 'center' },
  text: { marginBottom: spacing[8], textAlign: 'center' },
})
