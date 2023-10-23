import React, { useCallback } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import { colors } from '../../theme/colors'
import { textStyles } from '../../theme/typography'
import { sendMail } from '../../utils/links/utils'

export type EMailLinkProps = {
  recipient: string
  subject?: string
  content?: string
  testID: string
}

export const EMailLink: React.FC<EMailLinkProps> = ({ testID, recipient, subject, content }) => {
  const onPress = useCallback(async () => sendMail(recipient, subject, content), [content, recipient, subject])

  return (
    <Pressable testID={testID} onPress={onPress}>
      <Text style={[textStyles.BodyExtrabold, styles.linkText]}>{recipient}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  linkText: {
    color: colors.moonDarkest,
    textDecorationLine: 'underline',
  },
})
