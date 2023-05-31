import React from 'react'
import { ColorValue, Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import Checkmark from '../../assets/icons/checkmark.png'
import Mail from '../../assets/icons/mail.png'
import Chevron from '../../assets/icons/chevron.png'
import Cog from '../../assets/icons/cog.png'
import ArrowBack from '../../assets/icons/arrow-back.png'
import Age18 from '../../assets/icons/age18.png'
import Attention from '../../assets/icons/attention.png'
import Close from '../../assets/icons/close.png'
import ShowPassword from '../../assets/icons/show-password.png'
import HidePassword from '../../assets/icons/hide-password.png'
import InputError from '../../assets/icons/input-error.png'
import Coupon from '../../assets/icons/coupon.png'
import Book from '../../assets/icons/book.png'
import MapPin from '../../assets/icons/map-pin.png'
import Calendar from '../../assets/icons/calendar.png'
import Tag from '../../assets/icons/tag.png'
import Video from '../../assets/icons/Video.png'
import Music from '../../assets/icons/music.png'
import ArrowForward from '../../assets/icons/arrow-forward.png'
import LinkArrow from '../../assets/icons/link-arrow.png'
import ID1 from '../../assets/icons/id1.png'
import ID2 from '../../assets/icons/id2.png'
import IDCard from '../../assets/icons/id-card.png'
import Clipboard from '../../assets/icons/clipboard.png'
import Check from '../../assets/icons/check.png'
import Processing from '../../assets/icons/processing.png'
import Completed from '../../assets/icons/completed.png'
import Ready from '../../assets/icons/ready.png'
import Cancelled from '../../assets/icons/cancelled.png'
import Boings from '../../assets/icons/boings.png'
import HeartUnselected from '../../assets/icons/heart-unselected.png'
import HeartSelected from '../../assets/icons/heart-selected.png'
import Government from '../../assets/icons/government.png'
import HumanSketch from '../../assets/icons/human-sketch.png'
import CubeOne from '../../assets/icons/cube_one.png'
import CubeTwo from '../../assets/icons/cube_two.png'
import CubeThree from '../../assets/icons/cube_three.png'
import CubeFour from '../../assets/icons/cube_four.png'
import CubeFive from '../../assets/icons/cube_five.png'
import CubeSix from '../../assets/icons/cube_six.png'
import Info from '../../assets/icons/info.png'

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
  Video,
  Music,
  ArrowForward,
  LinkArrow,
  ID1,
  ID2,
  IDCard,
  Clipboard,
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
