import React, { useCallback } from 'react'
import { StyleSheet, Switch, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { DateFormField } from '../../components/form-fields/date-form-field'
import { ListItem } from '../../components/list-item/list-item'
import { ModalScreen } from '../../components/modal-screen/modal-screen'
import { ModalScreenHeader } from '../../components/modal-screen/modal-screen-header'
import { ScreenContent } from '../../components/screen/screen-content'
import { SvgImage } from '../../components/svg-image/svg-image'
import { TranslatedText } from '../../components/translated-text/translated-text'
import {
  setRandomLastName,
  setSimulateCard,
  setSimulatedCardDate,
  setSimulatedCardName,
} from '../../features/eid-verification/redux/simulated-card'
import {
  getRandomLastName,
  getSimulateCard,
  getSimulatedCardDate,
  getSimulatedCardName,
} from '../../features/eid-verification/redux/simulated-card-selectors'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { useTheme } from '../../theme/hooks/use-theme'
import { spacing } from '../../theme/spacing'

export type SimulationCardConfigScreenProps = {
  onHeaderPressBack: () => void
  onHeaderPressClose: () => void
}

export const SimulationCardConfigScreen: React.FC<SimulationCardConfigScreenProps> = ({
  onHeaderPressBack,
  onHeaderPressClose,
}) => {
  const { buildTestId } = useTestIdBuilder()
  const { colors } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const simulateCard = useSelector(getSimulateCard)
  const simulatedCardDate = useSelector(getSimulatedCardDate)
  const randomLastName = useSelector(getRandomLastName)

  const toggleSimulateCard = useCallback(() => {
    dispatch(setSimulateCard(!simulateCard))
  }, [dispatch, simulateCard])

  const toggleRandomLastName = useCallback(() => {
    dispatch(setRandomLastName(!randomLastName))
  }, [dispatch, randomLastName])

  const currentSimulationCardName = useSelector(getSimulatedCardName)

  const simulationCards: { [name: string]: any[] } = require('./simulation-cards/simulation-cards').simulationCards

  const cardNames = Object.keys(simulationCards)

  const onPressSimulatedCard = useCallback(
    (cardName: string) => {
      dispatch(setSimulatedCardName(cardName as any))
    },
    [dispatch],
  )

  const onDateChange = useCallback(
    (text: string | undefined) => {
      dispatch(setSimulatedCardDate(text))
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
      <View style={[styles.toggleListItem, { borderBottomColor: colors.listItemBorder }]}>
        <TranslatedText
          i18nKey="developerMenu_simulateCard_label"
          testID={buildTestId('developerMenu_simulateCard_label')}
          textStyle="BodyRegular"
          textStyleOverrides={{ color: colors.labelColor }}
        />
        <Switch
          testID={buildTestId('developerMenu_simulateCard_label')}
          accessibilityLabel={t('developerMenu_simulateCard_label')}
          value={simulateCard}
          onValueChange={toggleSimulateCard}
        />
      </View>
      {simulateCard ? (
        <ScreenContent>
          <View style={[styles.toggleListItem, { borderBottomColor: colors.listItemBorder }]}>
            <TranslatedText
              i18nKey="developerMenu_simulateCard_randomLastName_label"
              testID={buildTestId('developerMenu_simulateCard_randomLastName_label')}
              textStyle="BodyRegular"
              textStyleOverrides={{ color: colors.labelColor }}
            />
            <Switch
              testID={buildTestId('developerMenu_simulateCard_randomLastName_label')}
              accessibilityLabel={t('developerMenu_simulateCard_randomLastName_label')}
              value={randomLastName}
              onValueChange={toggleRandomLastName}
            />
          </View>
          <DateFormField
            testID={buildTestId('developerMenu_simulateCard_simulatedCardDate_label')}
            labelI18nKey="developerMenu_simulateCard_simulatedCardDate_label"
            onChange={onDateChange}
            value={simulatedCardDate}
            containerStyle={styles.dateField}
          />
          {cardNames.map(cardName => {
            return (
              <ListItem
                key={cardName}
                icon={
                  cardName === currentSimulationCardName ? (
                    <SvgImage type="chevron" width={24} height={24} />
                  ) : (
                    <View style={styles.noIcon} />
                  )
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
  noIcon: {
    width: 24,
  },
  dateField: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[5],
  },
  toggleListItem: {
    paddingHorizontal: spacing[5],
    height: spacing[10],
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
