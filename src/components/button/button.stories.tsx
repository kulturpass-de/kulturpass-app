import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button } from './button'

const componentMeta: ComponentMeta<typeof Button> = {
  title: 'Button',
  component: Button,
  args: {
    i18nKey: 'back_button',
    testID: 'testID',
    widthOption: 'stretch',
    disabled: false,
  },
  argTypes: { onPress: { action: 'onPress' } },
}

export default componentMeta

export const Primary: ComponentStory<typeof Button> = args => <Button {...args} />
export const PrimarySmall: ComponentStory<typeof Button> = args => (
  <Button {...args} modifier="small" widthOption="content" />
)

export const Secondary: ComponentStory<typeof Button> = args => <Button {...args} variant="secondary" />

export const Tertiary: ComponentStory<typeof Button> = args => <Button {...args} variant="tertiary" />
export const TertiarySmall: ComponentStory<typeof Button> = args => (
  <Button {...args} variant="tertiary" modifier="small" iconSource="arrow-right" />
)
export const TertiaryWidthContent: ComponentStory<typeof Button> = args => (
  <Button {...args} variant="tertiary" widthOption="content" iconSource="arrow-right" />
)
export const TertiaryWidthGrowContainerWidth80Percent: ComponentStory<typeof Button> = args => (
  <View style={styles.width80Percent}>
    <Button
      {...args}
      variant="tertiary"
      i18nKey="reservationDetail_header_voucherScenario_pickup_voucherSection_redeemButton"
      iconSource="link-arrow"
      iconPosition="left"
      widthOption="grow"
    />
  </View>
)
export const TertiaryWidthGrowContainerWidth10Percent: ComponentStory<typeof Button> = args => (
  <View style={styles.width10Percent}>
    <Button
      {...args}
      variant="tertiary"
      i18nKey="reservationDetail_header_voucherScenario_pickup_voucherSection_redeemButton"
      iconSource="link-arrow"
      iconPosition="left"
      widthOption="grow"
    />
  </View>
)

export const White: ComponentStory<typeof Button> = args => <Button {...args} variant="white" />

export const Transparent: ComponentStory<typeof Button> = args => <Button {...args} variant="transparent" />

export const VariantStyleOverrides: ComponentStory<typeof Button> = args => (
  <Button
    {...args}
    buttonColorOverrides={{
      text: 'red',
      containerBackground: 'green',
    }}
  />
)

const styles = StyleSheet.create({
  width10Percent: {
    width: '10%',
  },
  width80Percent: {
    width: '10%',
  },
})
