import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { GetProfileResponseBody } from '../../services/api/types/commerce/commerce-get-profile'
import { buildTestId } from '../../services/test-id/test-id'
import { useUserInfo } from '../../services/user/use-user-info'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'
import { useFormattedPrice } from '../../utils/price/hooks/use-formatted-price'
import { SvgImage } from '../svg-image/svg-image'
import { TranslatedText } from '../translated-text/translated-text'
import { UserBudgetBar } from '../user-budget-bar/user-budget-bar'
import { toValidBalance } from './budget-utils'

export type HomeBudgetProps = {
  balance: GetProfileResponseBody['balance']
}

export const HomeBudget: React.FC<HomeBudgetProps> = ({ balance }) => {
  const { colors } = useTheme()
  const { name } = useUserInfo()

  const formattedPrice = useFormattedPrice(balance.availableBalance)
  const formattedReservedAmount = useFormattedPrice(balance.reservedBalance)

  const validBalance = useMemo(() => toValidBalance(balance), [balance])

  const shouldShowBudgetBar =
    validBalance !== undefined && validBalance.availableBalance !== validBalance.grantedBalance

  const shouldShowReservedBalance = validBalance !== undefined && validBalance.reservedBalance > 0

  return (
    <View style={styles.container}>
      {name ? (
        <TranslatedText
          accessibilityRole="header"
          testID={buildTestId('home_budget_greeting_text')}
          textStyle="BodySmallMedium"
          i18nKey="home_budget_greeting"
          i18nParams={{ name }}
          textStyleOverrides={{ color: colors.labelColor }}
        />
      ) : (
        <TranslatedText
          accessibilityRole="header"
          testID={buildTestId('home_budget_title_text_without_user_text')}
          textStyle="BodySmallMedium"
          i18nKey="home_budget_greeting_without_user"
          textStyleOverrides={{ color: colors.labelColor }}
        />
      )}
      <View style={styles.amountContainer}>
        <TranslatedText
          testID={buildTestId('home_budget_amount_text')}
          textStyle="HeadlineH2Black"
          i18nKey="home_budget_amount"
          i18nParams={{ amount: formattedPrice }}
          textStyleOverrides={{ color: colors.labelColor }}
        />
        {shouldShowReservedBalance && (
          <View style={styles.reservedContainer}>
            <SvgImage type="coupon" style={styles.reservedIcon} width={20} height={20} />
            <TranslatedText
              testID={buildTestId('home_budget_amount_reserved_text')}
              textStyle="CaptionExtrabold"
              i18nKey="home_budget_amount_reserved"
              i18nParams={{ amount: formattedReservedAmount }}
              textStyleOverrides={[styles.reservedText, { color: colors.labelColor }]}
            />
          </View>
        )}
      </View>
      {shouldShowBudgetBar && (
        <UserBudgetBar
          max={validBalance.grantedBalance}
          available={validBalance.availableBalance}
          spent={validBalance.reservedBalance}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing[2],
    flexShrink: 0,
  },
  amountContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: spacing[4],
  },
  reservedContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    marginBottom: 10,
  },
  reservedIcon: {
    marginRight: spacing[2],
  },
  reservedText: {
    // workaround to center vertically the text
    marginTop: 4,
  },
})
