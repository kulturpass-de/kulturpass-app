import React, { useCallback, useMemo } from 'react'
import type { PropsWithChildren } from 'react'
import { Modal, type ModalProps } from 'react-native'
import { AlertBackdrop } from './alert-backdrop'
import { AlertContainer } from './alert-container'
import { AlertContextImpl } from './alert-context'

export type AlertProps = ModalProps &
  PropsWithChildren<{
    visible: boolean
    onChange?: (visible: boolean) => void
    dismissable?: boolean
  }>

export const Alert = ({ visible, onChange, children, dismissable, ...modalProps }: AlertProps) => {
  const onShow = useCallback(() => onChange?.(true), [onChange])
  const onHide = useCallback(() => onChange?.(false), [onChange])
  const providerValue = useMemo(() => ({ dismiss: onHide }), [onHide])

  return (
    <AlertContextImpl.Provider value={providerValue}>
      <Modal
        animationType="fade"
        presentationStyle="overFullScreen"
        transparent={true}
        visible={visible}
        onRequestClose={onHide}
        onShow={onShow}
        onDismiss={onHide}
        {...modalProps}>
        <AlertContainer>
          <AlertBackdrop dismissable={dismissable} />
          {children}
        </AlertContainer>
      </Modal>
    </AlertContextImpl.Provider>
  )
}
