import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { BulletListItem } from '../../../components/bullet-list-item/bullet-list-item'
import { useTestIdBuilder } from '../../../services/test-id/test-id'
import { useTranslation } from '../../../services/translation/translation'
import { useTheme } from '../../../theme/hooks/use-theme'
import { spacing } from '../../../theme/spacing'
import { textStyles } from '../../../theme/typography'
import { ReleaseNotesProps } from './release-notes-view'

const BULLET_SIZE = 6

type ReleaseNotesBulletListProps = Pick<ReleaseNotesProps, 'bodyTextListI18nKey'>

export const ReleaseNotesBulletList: React.FC<ReleaseNotesBulletListProps> = ({ bodyTextListI18nKey }) => {
  const { t } = useTranslation()
  const { colors } = useTheme()
  const { buildTestId } = useTestIdBuilder()

  const translatedBodyTextList = t(bodyTextListI18nKey)

  if (!translatedBodyTextList?.length) {
    return null
  }

  return (
    <View style={styles.list} testID={buildTestId('release_notes_bullet_list')}>
      {translatedBodyTextList.split('|').map(bulletWithDescription => (
        <View
          key={bulletWithDescription}
          style={styles.bulletItem}
          testID={buildTestId('release_notes_bullet_list_item')}>
          {bulletWithDescription.split(';').map((bulletOrDescription, i) => {
            return i === 0 ? (
              <BulletListItem
                key={bulletOrDescription}
                bulletSize={BULLET_SIZE}
                textStyle="BodyBold"
                testID={buildTestId('release_notes_bullet_list_item_bullet')}>
                <Text style={[styles.text, textStyles.BodyBold, { color: colors.labelColor }]}>
                  {bulletOrDescription}
                </Text>
              </BulletListItem>
            ) : (
              <BulletListItem
                key={bulletOrDescription}
                hideBullet
                bulletSize={BULLET_SIZE}
                textStyle="BodyRegular"
                testID={buildTestId('release_notes_bullet_list_item_description')}>
                <Text
                  key={bulletOrDescription}
                  style={[styles.text, textStyles.BodyRegular, { color: colors.labelColor }]}>
                  {bulletOrDescription}
                </Text>
              </BulletListItem>
            )
          })}
        </View>
      ))}
    </View>
  )
}

export const styles = StyleSheet.create({
  list: {
    width: '100%',
    rowGap: spacing[5],
  },
  text: { flexShrink: 1 },
  bulletItem: {
    rowGap: spacing[2],
  },
})
