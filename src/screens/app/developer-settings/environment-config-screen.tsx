import React, { useCallback, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { ListItem } from '../../../components/list-item/list-item'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { ModalScreen } from '../../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../../components/modal-screen/modal-screen-header'
import { ScreenContent } from '../../../components/screen/screen-content'
import { SvgImage } from '../../../components/svg-image/svg-image'
import { environmentConfigurations } from '../../../services/environment-configuration/environment-configuration'
import { useEnvironmentConfiguration } from '../../../services/environment-configuration/hooks/use-environment-configuration'
import { changeEnvironment } from '../../../services/environment-configuration/redux/thunks/change-environment'
import { AppDispatch } from '../../../services/redux/configure-store'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'

export type EnvironmentConfigScreenProps = {
  onHeaderPressBack: () => void
  onHeaderPressClose: () => void
}

export const EnvironmentConfigScreen: React.FC<EnvironmentConfigScreenProps> = ({
  onHeaderPressBack,
  onHeaderPressClose,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()

  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)

  const currentEnvironmentConfiguration = useEnvironmentConfiguration()

  const onPressEnvironment = useCallback(
    async (envName: string) => {
      setLoading(true)
      try {
        await dispatch(changeEnvironment(envName)).unwrap()
      } finally {
        setLoading(false)
      }
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
      <LoadingIndicator loading={loading} />
      <ScreenContent>
        {environmentConfigurations.data.map(environmentConfigurationItem => {
          return (
            <ListItem
              key={environmentConfigurationItem.name}
              icon={
                currentEnvironmentConfiguration.name === environmentConfigurationItem.name ? (
                  <SvgImage type="chevron" width={24} height={24} />
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
        <Text
          style={[
            styles.currentEnvironmentConfiguration,
            { color: colors.labelColor, borderColor: colors.labelColor },
          ]}>
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
    borderRadius: 5,
  },
  noIcon: {
    width: 24,
  },
})
