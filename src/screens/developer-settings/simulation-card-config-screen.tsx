import React, { useCallback } from 'react'
import { StyleSheet, Switch, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { Icon } from '../../components/icon/icon'
import { ListItem } from '../../components/list-item/list-item'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { getSimulateCard, getSimulatedCardName } from '../../features/eid-verification/redux/simulated-card-selectors'
import { setSimulateCard, setSimulatedCardName } from '../../features/eid-verification/redux/simulated-card'
import { TranslatedText } from '../../components/translated-text/translated-text'
import { spacing } from '../../theme/spacing'
import { useTranslation } from '../../services/translation/translation'
import { ScreenContent } from '../../components/screen/screen-content'
import { colors } from '../../theme/colors'

export type SimulationCardConfigScreenProps = {
  onHeaderPressBack: () => void
  onHeaderPressClose: () => void
}

export const SimulationCardConfigScreen: React.FC<SimulationCardConfigScreenProps> = ({
  onHeaderPressBack,
  onHeaderPressClose,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const simulateCard = useSelector(getSimulateCard)

  const toggleSimulateCard = useCallback(() => {
    dispatch(setSimulateCard(!simulateCard))
  }, [dispatch, simulateCard])

  const currentSimulationCardName = useSelector(getSimulatedCardName)

  const simulationCards: { [name: string]: any[] } = require('./simulation-cards/simulation-cards').simulationCards

  const cardNames = Object.keys(simulationCards)

  const onPressSimulatedCard = useCallback(
    (cardName: string) => {
      dispatch(setSimulatedCardName(cardName as any))
    },
    [dispatch],
  )

  return (
    <ModalScreen testID={buildTestId('developerMenu_simulateCard')}>
      <ModalScreenHeader
        titleI18nKey="developerMenu_simulateCard_headline_title"
        testID={buildTestId('developerMenu_simulateCard_headline_title')}
        onPressBack={onHeaderPressBack}
        onPressClose={onHeaderPressClose}
      />
      <View style={styles.toggleListItem}>
        <TranslatedText
          i18nKey="developerMenu_simulateCard_label"
          testID={buildTestId('developerMenu_simulateCard_label')}
          textStyle="BodyRegular"
          textStyleOverrides={styles.text}
        />
        <Switch
          testID={buildTestId('developerMenu_simulateCard_switch')}
          accessibilityLabel={t('developerMenu_simulateCard_label')}
          value={simulateCard}
          onValueChange={toggleSimulateCard}
        />
      </View>
      {simulateCard ? (
        <ScreenContent>
          {cardNames.map(cardName => {
            return (
              <ListItem
                key={cardName}
                icon={
                  <Icon
                    source="Chevron"
                    width={24}
                    height={24}
                    style={cardName === currentSimulationCardName ? styles.selectedCardIcon : styles.unselectedCardIcon}
                  />
                }
                title={cardName}
                testID={buildTestId(`developerMenu_simulateCard_${cardName}_button`)}
                // eslint-disable-next-line react/jsx-no-bind
                onPress={() => onPressSimulatedCard(cardName)}
              />
            )
          })}
        </ScreenContent>
      ) : null}
    </ModalScreen>
  )
}

const styles = StyleSheet.create({
  selectedCardIcon: {
    opacity: 1,
  },
  unselectedCardIcon: {
    opacity: 0,
  },
  text: {
    color: colors.basicBlack,
  },
  toggleListItem: {
    paddingHorizontal: spacing[5],
    height: spacing[10],
    borderBottomWidth: 2,
    borderBottomColor: '#E6E6E6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
