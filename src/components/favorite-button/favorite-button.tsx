import React, { useCallback } from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { Icon } from '../icon/icon'

export type FavoriteButtonProps = {
  active: boolean
  onPress: (active: boolean) => void
  accessibilityLabel: string
  testID: string
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ active, onPress, accessibilityLabel, testID }) => {
  const handlePress = useCallback(() => {
    onPress(!active)
  }, [active, onPress])

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={styles.favoriteButton}
      onPress={handlePress}>
      <Icon source={active ? 'HeartSelected' : 'HeartUnselected'} width={48} height={48} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  favoriteButton: {
    width: 48,
    height: 48,
  },
})
