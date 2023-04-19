import React from 'react'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { TranslatedText } from './translated-text'

export const TranslatedTextExample = () => {
  const { buildTestId } = useTestIdBuilder()
  return (
    <TranslatedText
      testID={buildTestId('home_bottomNavigation_label')}
      i18nKey="home_bottomNavigation_label"
      textStyle="BodyRegular"
    />
  )
}

export const TranslatedTextExample2 = () => {
  const { buildTestId } = useTestIdBuilder()
  return (
    <TranslatedText
      testID={buildTestId('favorites_bottomNavigation_label')}
      i18nKey="favorites_bottomNavigation_label"
      textStyle="SubtitleExtrabold"
    />
  )
}
