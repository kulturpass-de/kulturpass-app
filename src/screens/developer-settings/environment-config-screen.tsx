import React, { useCallback } from 'react'
import { StyleSheet, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { Icon } from '../../components/icon/icon'
import { ListItem } from '../../components/list-item/list-item'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { environmentConfigurations } from '../../services/environment-configuration/environment-configuration'
import { AppDispatch, RootState } from '../../services/redux/configure-store'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { changeEnvironment } from '../../services/environment-configuration/redux/thunks/change-environment'
import { ScreenContent } from '../../components/screen/screen-content'
import { colors } from '../../theme/colors'

/* eslint-disable react/jsx-no-bind */

const styles = StyleSheet.create({
  currentEnvironmentConfiguration: {
    margin: 10,
    paddingTop: 14,
    paddingLeft: 19,
    paddingBottom: 14,
    paddingRight: 19,
    borderWidth: 1,
    borderColor: colors.moonDarkest,
    borderRadius: 5,
    color: colors.moonDarkest,
  },
  selectedEnvironmentIcon: {
    opacity: 1,
  },
  unselectedEnvironmentIcon: {
    opacity: 0,
  },
})

export type EnvironmentConfigScreenProps = {
  onHeaderPressBack: () => void
  onHeaderPressClose: () => void
}

export const EnvironmentConfigScreen: React.FC<EnvironmentConfigScreenProps> = ({
  onHeaderPressBack,
  onHeaderPressClose,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const dispatch = useDispatch<AppDispatch>()

  const currentEnvironmentConfiguration = useSelector(
    (state: RootState) => state.persisted.environmentConfiguration.currentEnvironment,
  )

  const onPressEnvironment = useCallback(
    (envName: string) => {
      dispatch(changeEnvironment(envName))
    },
    [dispatch],
  )

  return (
    <ModalScreen testID={buildTestId('environmentConfiguration')}>
      <ModalScreenHeader
        titleI18nKey="environmentConfiguration_headline_title"
        testID={buildTestId('environmentConfiguration_headline_title')}
        onPressBack={onHeaderPressBack}
        onPressClose={onHeaderPressClose}
      />
      <ScreenContent>
        {environmentConfigurations.data.map(environmentConfigurationItem => {
          return (
            <ListItem
              key={environmentConfigurationItem.name}
              icon={
                <Icon
                  source="Chevron"
                  width={24}
                  height={24}
                  style={
                    currentEnvironmentConfiguration.name === environmentConfigurationItem.name
                      ? styles.selectedEnvironmentIcon
                      : styles.unselectedEnvironmentIcon
                  }
                />
              }
              title={environmentConfigurationItem.name}
              testID={buildTestId(`environmentConfiguration_${environmentConfigurationItem.name}_button`)}
              onPress={() => onPressEnvironment(environmentConfigurationItem.name)}
            />
          )
        })}
        <Text style={styles.currentEnvironmentConfiguration}>
          {JSON.stringify(currentEnvironmentConfiguration, null, 4)}
        </Text>
      </ScreenContent>
    </ModalScreen>
  )
}
