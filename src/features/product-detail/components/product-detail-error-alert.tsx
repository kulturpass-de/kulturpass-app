import React, { useCallback } from 'react'
import { Alert } from '../../../components/alert/alert'
import { AlertButtonDismiss } from '../../../components/alert/alert-button-dismiss'
import { AlertContent } from '../../../components/alert/alert-content'
import { AlertMessage } from '../../../components/alert/alert-message'
import { AlertTitle } from '../../../components/alert/alert-title'
import { useTestIdBuilder } from '../../../services/test-id/test-id'

type ProductDetailErrorAlertProps = {
  error: 'productDetail_getProductDetailError_message' | 'productDetail_reservationError_message'
  visible: boolean
  onClose: () => void
}

export const ProductDetailErrorAlert: React.FC<ProductDetailErrorAlertProps> = ({ error, visible, onClose }) => {
  const { buildTestId } = useTestIdBuilder()

  const onErrorChange = useCallback(
    (newVal: boolean) => {
      if (!newVal) {
        onClose()
      }
    },
    [onClose],
  )

  return (
    <Alert visible={visible} onChange={onErrorChange} dismissable={true}>
      <AlertContent>
        <AlertTitle i18nKey="productDetail_error_title" testID={buildTestId('productDetail_error_title')} />
        <AlertMessage i18nKey={error} testID={buildTestId(error)} />
        <AlertButtonDismiss i18nKey="alert_cta" onPress={onClose} testID={buildTestId('alert_cta')} />
      </AlertContent>
    </Alert>
  )
}
