import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'
import { Illustration } from '../../../components/illustration/illustration'
import { ListItem } from '../../../components/list-item/list-item'
import { Screen } from '../../../components/screen/screen'
import { ScreenHeader } from '../../../components/screen/screen-header'
import { TranslatedText } from '../../../components/translated-text/translated-text'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { useQueryMobilityOffersVoucherCampaigns } from '../hooks/use-query-mobility-offers'
import { MobilityOffersVoucherCampaigns } from '../types/mobility-offers-types'
import { isSupportedTemplate } from '../utility'

export type MobilityOffersScreenProps = {
  onPressBackButton: () => void
  navigateToMobilityOffers: (campaignCode: string) => void
}

export const MobilityOffersScreen: React.FC<MobilityOffersScreenProps> = ({
  onPressBackButton,
  navigateToMobilityOffers,
}) => {
  const { buildTestId, addTestIdModifier } = useTestIdBuilder()
  const testID = buildTestId('mobility_offers_screen')
  const { t } = useTranslation()
  const { colors } = useTheme()
  const keyExtractor = useCallback((item: MobilityOffersVoucherCampaigns) => item.code, [])
  const { data: campaignsData, isLoading, refetch } = useQueryMobilityOffersVoucherCampaigns({ query: 'flix' })

  useFocusEffect(
    useCallback(() => {
      refetch()
      return () => {}
    }, [refetch]),
  )
  const pressVoucherCode = useCallback(
    async (campaignCode: string) => {
      navigateToMobilityOffers(campaignCode)
    },
    [navigateToMobilityOffers],
  )

  const handleListItemPress = useCallback(
    (campaignCode: string) => () => {
      pressVoucherCode(campaignCode)
    },
    [pressVoucherCode],
  )

  const campaigns = useMemo(() => {
    return campaignsData?.campaigns.filter(campaign => {
      return isSupportedTemplate(campaign.template)
    })
  }, [campaignsData?.campaigns])

  const renderItem = useCallback(
    ({ item }: { item: MobilityOffersVoucherCampaigns }) => {
      return (
        <ListItem
          key={item.code}
          title={item.description}
          testID={addTestIdModifier(testID, `${item.code}_text`)}
          type="navigation"
          onPress={handleListItemPress(item.code)}
        />
      )
    },
    [addTestIdModifier, handleListItemPress, testID],
  )

  const listEmptyComponent = useCallback(() => {
    if (isLoading) {
      return null
    }

    return (
      <View style={styles.emptyStateContainer}>
        <Illustration
          testID={addTestIdModifier(testID, 'empty_voucher_list_image')}
          i18nKey="empty-voucher-list-image-alt"
          type="empty-voucher-list-image"
        />
        <TranslatedText
          textStyleOverrides={[styles.text, { color: colors.labelColor }]}
          i18nKey={'empty-voucher-list-image-message'}
          testID={addTestIdModifier(testID, 'empty_voucher_list_image_message')}
          textStyle="BodyRegular"
        />
      </View>
    )
  }, [isLoading, colors.labelColor, testID, addTestIdModifier])

  return (
    <Screen
      testID={testID}
      header={
        <ScreenHeader
          testID={addTestIdModifier(testID, 'title')}
          title={t('mobility_offers_title')}
          onPressBack={onPressBackButton}
          screenType="subscreen"
        />
      }>
      <View style={styles.container}>
        <FlatList
          data={campaigns}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onRefresh={refetch}
          refreshing={isLoading}
          contentContainerStyle={styles.scrollViewContainer}
          ListEmptyComponent={listEmptyComponent}
        />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
  },
  container: {
    paddingTop: spacing[6],
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    padding: spacing[5],
  },
  text: {
    flexWrap: 'wrap',
    textAlign: 'center',
  },
})
