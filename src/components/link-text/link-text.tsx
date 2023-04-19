import React, { useCallback } from 'react'
import { Linking, Pressable, StyleSheet, TextStyle, View } from 'react-native'
import { useTestIdBuilder } from '../../services/test-id/test-id'
import { colors } from '../../theme/colors'
import { Icon } from '../icon/icon'
import { TranslatedText, TranslatedTextProps } from '../translated-text/translated-text'
import { AvailableTranslations } from '../translated-text/types'

type LinkTextProps = {
  link: string
  i18nKey: AvailableTranslations
  style?: TextStyle
  iconSize?: number
  textStyle?: TranslatedTextProps['textStyle']
  flex?: boolean
}

export const LinkText: React.FC<LinkTextProps> = ({ link, i18nKey, iconSize = 24, textStyle, style, flex = true }) => {
  const { buildTestId } = useTestIdBuilder()

  const handlePress = useCallback(async () => {
    try {
      if (await Linking.canOpenURL(link)) {
        await Linking.openURL(link)
      } else {
        console.error('Link not supported by System')
      }
    } catch (e) {
      console.error('Failed opening the Link')
    }
  }, [link])

  const linkTestId = buildTestId(i18nKey)

  return (
    <View style={[styles.container, style]}>
      <Icon width={iconSize} height={iconSize} source="LinkArrow" />
      <Pressable
        style={[styles.textPadding, flex ? styles.textFlex : undefined]}
        onPress={handlePress}
        testID={linkTestId + '_button'}>
        <TranslatedText
          testID={linkTestId}
          textStyleOverrides={styles.text}
          textStyle={textStyle ?? 'BodyRegular'}
          i18nKey={i18nKey}
        />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  textPadding: {
    paddingLeft: 6,
  },
  textFlex: {
    flex: 1,
  },
  text: {
    flexWrap: 'wrap',
    color: colors.moonDarkest,
    textDecorationLine: 'underline',
  },
})
