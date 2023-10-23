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
        // DO NOT USE `animationType`
        // this leads to a ui issue
        // in which the refresh control is not hiding anymore when opening a modal in parallel
        // the workaround is to animate the modal on our own
        // see `AlertContainer`
        presentationStyle="overFullScreen"
        transparent={true}
        visible={visible}
        onRequestClose={onHide}
        onShow={onShow}
        onDismiss={onHide}
        {...modalProps}>
        <AlertContainer visible={visible}>
          <AlertBackdrop dismissable={dismissable} />
          {children}
        </AlertContainer>
      </Modal>
    </AlertContextImpl.Provider>
  )
}
