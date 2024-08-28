import React from 'react'
import { Badge } from '../../../components/badge/badge'
import { useTestIdBuilder } from '../../../services/test-id/test-id'

export const BetaBadge: React.FC = () => {
  const { buildTestId } = useTestIdBuilder()
  return (
    <Badge
      i18nKey="identification_beta_badge"
      testID={buildTestId('identification_beta_badge')}
      backgroundColorVariant="blue"
    />
  )
}
