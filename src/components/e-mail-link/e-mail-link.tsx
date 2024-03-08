import React, { useCallback } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { useTranslation } from '../../services/translation/translation'
import { useTextStyles } from '../../theme/hooks/use-text-styles'
import { useTheme } from '../../theme/hooks/use-theme'
import { sendMail } from '../../utils/links/utils'

export type EMailLinkProps = {
  recipient: string
  subject?: string
  content?: string
  testID: string
}

export const EMailLink: React.FC<EMailLinkProps> = ({ testID, recipient, subject, content }) => {
  const { colors } = useTheme()
  const onPress = useCallback(async () => sendMail(recipient, subject, content), [content, recipient, subject])
  const { t } = useTranslation()
  const textStyles = useTextStyles()

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="link"
      accessibilityHint={t('external_link_short_accessibility_announcement')}
      accessible>
      <Text style={[textStyles.BodyExtrabold, styles.linkText, { color: colors.labelColor }]}>{recipient}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  linkText: {
    textDecorationLine: 'underline',
  },
})
