import { fireEvent, screen } from '@testing-library/react-native'
import React from 'react'
import { buildTestId } from '../../../services/test-id/test-id'
import { renderScreen } from '../../../services/testing/test-utils'
import { UpdateProfileScreen, UpdateProfileScreenProps } from './update-profile-screen'

const afterUpdate = jest.fn()
const onHeaderPressClose = jest.fn()

const ACCOUNT_INFO_DATA: UpdateProfileScreenProps['accountInfoData'] = {
  data: {
    eid: { dateOfBirth: '2005-02-01' },
    dateOfBirth: '2005-02-01',
    preferredProductCategoryId2: 'audioMedia',
    preferredProductCategoryId1: 'musicInstrument',
    preferredProductCategoryId4: 'cinema',
    preferredProductCategoryId3: 'museumAndPark',
    preferredPostalCode: '06911',
    idVerified: 'true',
  },
  profile: { firstName: 'Xxxc', email: 'test@sap.com' },
}

test('Should render update screen', async () => {
  renderScreen(
    <UpdateProfileScreen
      afterUpdate={afterUpdate}
      accountInfoData={ACCOUNT_INFO_DATA}
      onHeaderPressClose={onHeaderPressClose}
    />,
  )
  expect(screen.getByTestId(buildTestId('updateProfile_screen'))).toBeOnTheScreen()
})

test('Should display the UpdateProfileAlert when pressing cancel, since changes to the name were made. Dismiss first, then discard', async () => {
  renderScreen(
    <UpdateProfileScreen
      afterUpdate={afterUpdate}
      accountInfoData={ACCOUNT_INFO_DATA}
      onHeaderPressClose={onHeaderPressClose}
    />,
  )

  expect(screen.queryByTestId(buildTestId('updateProfile_headline_closeButton'))).not.toBeOnTheScreen()
  expect(screen.queryByTestId(buildTestId('updateProfile_headline_backButton'))).toBeOnTheScreen()

  let emailInput = await screen.findByTestId(buildTestId('updateProfile_email_input'))

  // do change, close button should appear

  fireEvent.changeText(emailInput, 'test2@sap.com')

  expect(emailInput).toBeDisabled()
  expect(screen.queryByTestId(buildTestId('updateProfile_headline_closeButton'))).not.toBeOnTheScreen()

  let nameInput = await screen.findByTestId(buildTestId('updateProfile_name_input'))

  fireEvent.changeText(nameInput, 'new name')

  expect(screen.queryByTestId(buildTestId('updateProfile_headline_closeButton'))).toBeOnTheScreen()
  expect(screen.queryByTestId(buildTestId('updateProfile_headline_backButton'))).toBeOnTheScreen()

  fireEvent.press(screen.getByTestId(buildTestId('updateProfile_headline_closeButton')))

  expect(screen.queryByTestId(buildTestId('update_profile_alert_title'))).toBeOnTheScreen()

  fireEvent.press(screen.getByTestId(buildTestId('update_profile_alert_dismiss')))

  expect(onHeaderPressClose).toHaveBeenCalledTimes(0)

  fireEvent.press(screen.getByTestId(buildTestId('updateProfile_headline_closeButton')))

  fireEvent.press(screen.getByTestId(buildTestId('update_profile_alert_discard')))

  expect(onHeaderPressClose).toHaveBeenCalledTimes(1)
})

test('Should display the UpdateProfileAlert when navigating back, since changes to the name were made', async () => {
  renderScreen(
    <UpdateProfileScreen
      afterUpdate={afterUpdate}
      accountInfoData={ACCOUNT_INFO_DATA}
      onHeaderPressClose={onHeaderPressClose}
    />,
  )

  let nameInput = await screen.findByTestId(buildTestId('updateProfile_name_input'))
  fireEvent.changeText(nameInput, 'new name')

  fireEvent.press(screen.getByTestId(buildTestId('updateProfile_headline_backButton')))

  // UpdateProfileAlert visible

  expect(screen.queryByTestId(buildTestId('update_profile_alert_title'))).toBeOnTheScreen()

  fireEvent.press(screen.getByTestId(buildTestId('update_profile_alert_dismiss')))

  expect(onHeaderPressClose).toHaveBeenCalledTimes(0)

  fireEvent.press(screen.getByTestId(buildTestId('updateProfile_headline_closeButton')))

  fireEvent.press(screen.getByTestId(buildTestId('update_profile_alert_discard')))

  expect(onHeaderPressClose).toHaveBeenCalledTimes(1)
})

test('Should navigate back since no changes to the profile were made', async () => {
  renderScreen(
    <UpdateProfileScreen
      afterUpdate={afterUpdate}
      accountInfoData={ACCOUNT_INFO_DATA}
      onHeaderPressClose={onHeaderPressClose}
    />,
  )

  fireEvent.press(screen.getByTestId(buildTestId('updateProfile_headline_backButton')))

  // UpdateProfileAlert not visible

  expect(screen.queryByTestId(buildTestId('update_profile_alert_title'))).not.toBeOnTheScreen()

  expect(onHeaderPressClose).toHaveBeenCalledTimes(1)
})

afterEach(() => {
  jest.clearAllMocks()
})
