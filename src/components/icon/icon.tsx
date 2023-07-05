import React from 'react'
import { ColorValue, Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Age18 from '../../assets/icons/age18.png'
import ArrowBack from '../../assets/icons/arrow-back.png'
import ArrowForward from '../../assets/icons/arrow-forward.png'
import Attention from '../../assets/icons/attention.png'
import Boings from '../../assets/icons/boings.png'
import Book from '../../assets/icons/book.png'
import Calendar from '../../assets/icons/calendar.png'
import Cancelled from '../../assets/icons/cancelled.png'
import Check from '../../assets/icons/check.png'
import Checkmark from '../../assets/icons/checkmark.png'
import Chevron from '../../assets/icons/chevron.png'
import ClipboardCopy from '../../assets/icons/clipboard-copy.png'
import Clipboard from '../../assets/icons/clipboard.png'
import Close from '../../assets/icons/close.png'
import Cog from '../../assets/icons/cog.png'
import Completed from '../../assets/icons/completed.png'
import Coupon from '../../assets/icons/coupon.png'
import CubeFive from '../../assets/icons/cube_five.png'
import CubeFour from '../../assets/icons/cube_four.png'
import CubeOne from '../../assets/icons/cube_one.png'
import CubeSix from '../../assets/icons/cube_six.png'
import CubeThree from '../../assets/icons/cube_three.png'
import CubeTwo from '../../assets/icons/cube_two.png'
import Government from '../../assets/icons/government.png'
import HeartSelected from '../../assets/icons/heart-selected.png'
import HeartUnselected from '../../assets/icons/heart-unselected.png'
import HidePassword from '../../assets/icons/hide-password.png'
import HumanSketch from '../../assets/icons/human-sketch.png'
import ID1 from '../../assets/icons/id1.png'
import ID2 from '../../assets/icons/id2.png'
import IDCard from '../../assets/icons/id-card.png'
import Info from '../../assets/icons/info.png'
import InputError from '../../assets/icons/input-error.png'
import LinkArrow from '../../assets/icons/link-arrow.png'
import Mail from '../../assets/icons/mail.png'
import MapPin from '../../assets/icons/map-pin.png'
import Music from '../../assets/icons/music.png'
import NFC from '../../assets/icons/nfc.png'
import Processing from '../../assets/icons/processing.png'
import Ready from '../../assets/icons/ready.png'
import ShowPassword from '../../assets/icons/show-password.png'
import Tag from '../../assets/icons/tag.png'

const availableSources = {
  Checkmark,
  Mail,
  Chevron,
  Cog,
  ArrowBack,
  Close,
  Age18,
  Attention,
  ShowPassword,
  HidePassword,
  InputError,
  Coupon,
  Book,
  MapPin,
  Calendar,
  Tag,
  Music,
  ArrowForward,
  LinkArrow,
  ID1,
  ID2,
  IDCard,
  Clipboard,
  ClipboardCopy,
  Check,
  Processing,
  Completed,
  Ready,
  Cancelled,
  Boings,
  HeartUnselected,
  HeartSelected,
  Government,
  HumanSketch,
  CubeOne,
  CubeTwo,
  CubeThree,
  CubeFour,
  CubeFive,
  CubeSix,
  Info,
  NFC,
} as const

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
})

export type IconProps = {
  source: keyof typeof availableSources
  style?: StyleProp<ViewStyle>
  width?: number
  height?: number
  tintColor?: ColorValue
  accessibilityLabel?: string
}

export const Icon: React.FC<IconProps> = ({
  source,
  style,
  width = 24,
  height = 24,
  tintColor,
  accessibilityLabel,
}) => {
  return (
    <View style={[styles.container, style, { width, height }]}>
      <Image
        style={[styles.image, { tintColor }]}
        source={availableSources[source]}
        accessibilityLabel={accessibilityLabel}
      />
    </View>
  )
}
