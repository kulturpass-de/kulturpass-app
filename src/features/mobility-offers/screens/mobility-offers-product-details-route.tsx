import { NavigatorScreenParams, useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { ModalScreenProps } from '../../../navigation/modal/types'
import { useTabsNavigation } from '../../../navigation/tabs/hooks'
import { RootStackParams } from '../../../navigation/types'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { ErrorAlertManager } from '../../../services/errors/error-alert-provider'
import { ErrorWithCode } from '../../../services/errors/errors'
import { AppDispatch } from '../../../services/redux/configure-store'
import { modalCardStyle } from '../../../theme/utils'
import { GetMobilityOffersVoucherAlert } from '../components/get-mobility-offer-voucher-alert'
import { MobilityOffersErrorAlert } from '../components/mobility-offers-error-alert'
import {
  CampaignAccessDeniedError,
  CampaignCodeExpiredError,
  CampaignNotEligibleError,
  MobilityCustomError,
} from '../errors/errors'
import { mobilityVoucherFlow } from '../redux/thunks/mobility-voucher-flow-thunk'
import { startMobilityVoucherFlow } from '../redux/thunks/start-mobility-voucher-flow-thunk'
import { ClaimVoucherCampaignResponse } from '../types/mobility-voucher-campaign-types'
import { MobilityOffersErrorPageRouteName } from './mobility-offers-error-page-route'
import { MobilityOffersProduct } from './mobility-offers-product'
import { MobilityOffersProductDetailScreen } from './mobility-offers-product-detail-screen'

export const MobilityOffersProductDetailsRouteName = 'MobilityOffersProductDetailsRoute'

export type MobilityOffersProductDetailsRouteParams = {
  campaignCode: string
}

export type MobilityOffersProductDetailsRouteStackParams = {
  MobilityOffersProductDetails: NavigatorScreenParams<MobilityOffersProductDetailsRouteParams>
}

export type MobilityOffersProductDetailsRouteProps = ModalScreenProps<'MobilityOffersProductDetailsRoute'>

export const MobilityOffersProductDetailsRoute: React.FC<MobilityOffersProductDetailsRouteProps> = ({ route }) => {
  const [voucherAlertVisible, setVoucherAlertVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)
  const [voucherData, setVoucherData] = useState<ClaimVoucherCampaignResponse>()

  const tabNavigation = useTabsNavigation()
  const onClose = useCallback(() => {
    tabNavigation.goBack()
    setVoucherAlertVisible(false)
  }, [tabNavigation])

  const showVoucherAlert = useCallback(() => {
    setVoucherAlertVisible(true)
  }, [])

  const navigation = useNavigation<StackNavigationProp<RootStackParams, 'Tabs'>>()
  const goBack = useCallback(async () => {
    navigation.navigate('Tabs')
  }, [navigation])

  const handleCancelGetMobilityOffersVoucherAlert = useCallback(() => {
    setVoucherAlertVisible(false)
  }, [])

  const handleCancelMobilityOffersErrorAlert = useCallback(() => {
    setCancelAlertVisible(false)
    goBack()
  }, [goBack])

  const { params } = route
  const modalNavigation = useModalNavigation()
  const navigateToMobilityOffersErrorPage = useCallback(
    (error: MobilityCustomError) => {
      modalNavigation.navigate({
        screen: MobilityOffersErrorPageRouteName,
        params: { error: error },
      })
    },
    [modalNavigation],
  )

  const setError = useCallback(
    (error: unknown) => {
      if (error instanceof CampaignNotEligibleError || error instanceof CampaignCodeExpiredError) {
        navigateToMobilityOffersErrorPage(error)
        return
      }

      if (error instanceof CampaignAccessDeniedError) {
        setCancelAlertVisible(true)
        return
      }

      if (error instanceof ErrorWithCode) {
        ErrorAlertManager.current?.showError(error)
        goBack()
      }
    },
    [goBack, navigateToMobilityOffersErrorPage],
  )

  const dispatch = useDispatch<AppDispatch>()
  const getVoucherData = useCallback(
    async (campaignCode: string) => {
      setIsLoading(true)
      try {
        const response = await dispatch(startMobilityVoucherFlow({ campaignCode: campaignCode })).unwrap()
        setVoucherData(response)
      } catch (error) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    },
    [dispatch, setError],
  )

  useEffect(() => {
    getVoucherData(params?.campaignCode)
  }, [getVoucherData, params?.campaignCode])

  const getVoucherCode = useCallback(async () => {
    setIsLoading(true)
    setVoucherAlertVisible(false)
    try {
      const response = await dispatch(mobilityVoucherFlow({ campaignCode: params?.campaignCode })).unwrap()
      setVoucherData(response)
    } catch (error) {
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, params?.campaignCode, setError])

  return (
    <>
      <LoadingIndicator loading={isLoading} debounceTime={350} />
      {voucherData && (
        <>
          {!voucherData?.voucher?.code ? (
            <MobilityOffersProduct
              onClose={onClose}
              isLoading={isLoading}
              showVoucherAlert={showVoucherAlert}
              voucherData={voucherData}
            />
          ) : (
            <MobilityOffersProductDetailScreen onClose={onClose} voucherData={voucherData} />
          )}
        </>
      )}

      {voucherData && (
        <GetMobilityOffersVoucherAlert
          onChange={setVoucherAlertVisible}
          visible={voucherAlertVisible}
          getVoucherCode={getVoucherCode}
          voucherData={voucherData}
          handleCancel={handleCancelGetMobilityOffersVoucherAlert}
        />
      )}

      <MobilityOffersErrorAlert
        visible={cancelAlertVisible}
        onChange={setCancelAlertVisible}
        handleCancel={handleCancelMobilityOffersErrorAlert}
      />
    </>
  )
}

export const MobilityOffersProductDetailsRouteConfig = createRouteConfig({
  name: MobilityOffersProductDetailsRouteName,
  component: MobilityOffersProductDetailsRoute,
  options: { cardStyle: modalCardStyle },
})
