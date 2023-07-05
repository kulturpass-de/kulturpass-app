/* eslint-disable react/jsx-no-bind */
import React from 'react'
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

export const Alert = ({ visible, onChange = () => {}, children, dismissable, ...modalProps }: AlertProps) => {
  return (
    <AlertContextImpl.Provider value={{ dismiss: () => onChange(false) }}>
      <Modal
        animationType="fade"
        presentationStyle="overFullScreen"
        transparent={true}
        visible={visible}
        onRequestClose={() => onChange(false)}
        onShow={() => onChange(true)}
        onDismiss={() => onChange(false)}
        {...modalProps}>
        <AlertContainer>
          <AlertBackdrop dismissable={dismissable} />
          {children}
        </AlertContainer>
      </Modal>
    </AlertContextImpl.Provider>
  )
}
