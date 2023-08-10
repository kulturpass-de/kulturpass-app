import React from 'react'
import { Pressable, PressableProps } from 'react-native'
import { TestId } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { HITSLOP } from '../../theme/constants'
import { SvgImage } from '../svg-image/svg-image'

export type FavoriteButtonProps = {
  isFavorite: boolean
  onPress: () => void
  testID: TestId
  hitSlop?: PressableProps['hitSlop']
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ isFavorite, onPress, testID, hitSlop }) => {
  const { t } = useTranslation()

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? t('favorites_item_remove_a11y_label') : t('favorites_item_add_a11y_label')}
      testID={testID}
      onPress={onPress}
      hitSlop={hitSlop || HITSLOP}>
      <SvgImage type={isFavorite ? 'heart-selected' : 'heart-unselected'} width={36} height={36} />
    </Pressable>
  )
}
