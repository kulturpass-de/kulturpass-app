import React from 'react'
import { Pressable, PressableProps } from 'react-native'

import { TestId } from '../../services/test-id/test-id'
import { useTranslation } from '../../services/translation/translation'
import { HITSLOP } from '../../theme/constants'
import { Icon } from '../icon/icon'

export type FavoriteButtonProps = {
  isFavorite: boolean
  onPress: () => void
  testID: TestId
  hitSlop?: PressableProps['hitSlop']
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ isFavorite, onPress, testID, hitSlop }) => {
  const { t } = useTranslation()

  if (!isFavorite) {
    // NOTE: Currently, when the item is removed from favourites - we display only an "empty" icon without Pressable.
    // Later when the api is available to re-add the item to favourites - we need to add a Pressable with the same props
    // as the ones on the "remove from favourites" Pressable, with the only difference in
    // `accessibilityLabel={t('favorites_item_add_a11y_label')}`
    return <Icon source="HeartUnselected" width={36} height={36} />
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('favorites_item_remove_a11y_label')}
      testID={testID}
      onPress={onPress}
      hitSlop={hitSlop || HITSLOP}>
      <Icon source="HeartSelected" width={36} height={36} />
    </Pressable>
  )
}
