import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { BulletListItem } from '../../../components/bullet-list-item/bullet-list-item'
import { AvailableTranslations } from '../../../components/translated-text/types'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { getDisplayVersion } from '../utils/get-display-version'
import { ReleaseNotesProps } from './release-notes-view'

const BULLET_SIZE = 6
const RELEASE_FEATURES_VERSION = '1.8'
const RELEASE_FEATURE_COUNT = 2

type ReleaseNotesBulletListProps = Pick<ReleaseNotesProps, 'bodyTextListBaseI18nKey'>

export const ReleaseNotesBulletList: React.FC<ReleaseNotesBulletListProps> = ({ bodyTextListBaseI18nKey }) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { buildTestId } = useTestIdBuilder()

  const i18nKeys = useMemo(() => {
    if (RELEASE_FEATURES_VERSION !== getDisplayVersion()) {
      return []
    }
    const translationKeys = []

    for (let itemNumber = 1; itemNumber <= RELEASE_FEATURE_COUNT; itemNumber++) {
      const keyPrefix = `${bodyTextListBaseI18nKey}${itemNumber}`
      const headlineKey = `${keyPrefix}_headline` as AvailableTranslations
      const textKey = `${keyPrefix}_text` as AvailableTranslations
      translationKeys.push({ headlineKey, textKey, keyPrefix })
    }
    return translationKeys
  }, [bodyTextListBaseI18nKey])

  return (
    <View style={styles.list} testID={buildTestId('release_notes_bullet_list')}>
      {i18nKeys.map(keys => (
        <View key={keys.keyPrefix} style={styles.bulletItem} testID={buildTestId(keys.keyPrefix)}>
          <BulletListItem
            bulletSize={BULLET_SIZE}
            textStyle="BodyBold"
            testID={buildTestId('release_notes_bullet_list_item_bullet')}>
            <Text
              testID={buildTestId(keys.headlineKey)}
              style={[styles.bulletTextGap, textStyles.BodyBold, { color: colors.labelColor }]}>
              {t(keys.headlineKey)}
            </Text>
            <Text testID={buildTestId(keys.textKey)} style={[textStyles.BodyRegular, { color: colors.labelColor }]}>
              {t(keys.textKey)}
            </Text>
          </BulletListItem>
        </View>
      ))}
    </View>
  )
}

export const styles = StyleSheet.create({
  list: {
    rowGap: spacing[5],
  },
  bulletTextGap: {
    paddingBottom: spacing[2],
  },
  bulletItem: {
    rowGap: spacing[2],
  },
})
