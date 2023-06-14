import React, { useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useDispatch } from 'react-redux'

import { ListItem } from '../../components/list-item/list-item'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { environmentConfigurations } from '../../services/environment-configuration/environment-configuration'
import { AppDispatch } from '../../services/redux/configure-store'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { changeEnvironment } from '../../services/environment-configuration/redux/thunks/change-environment'
import { ScreenContent } from '../../components/screen/screen-content'
import { colors } from '../../theme/colors'
import { Icon } from '../../components/icon/icon'
import { spacing } from '../../theme/spacing'
import { useEnvironmentConfiguration } from '../../services/environment-configuration/hooks/use-environment-configuration'

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

  const currentEnvironmentConfiguration = useEnvironmentConfiguration()

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
                currentEnvironmentConfiguration.name === environmentConfigurationItem.name ? (
                  <Icon source="Chevron" width={24} height={24} />
                ) : (
                  <View style={styles.noIcon} />
                )
              }
              title={environmentConfigurationItem.name}
              testID={buildTestId(`environmentConfiguration_${environmentConfigurationItem.name}_button`)}
              // eslint-disable-next-line react/jsx-no-bind
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

const styles = StyleSheet.create({
  currentEnvironmentConfiguration: {
    margin: spacing[3],
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[5],
    borderWidth: 1,
    borderColor: colors.moonDarkest,
    borderRadius: 5,
    color: colors.moonDarkest,
  },
  noIcon: {
    width: 24,
  },
})
