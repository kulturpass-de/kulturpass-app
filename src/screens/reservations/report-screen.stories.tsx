import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import React from 'react'
import { Text } from 'react-native'
import { ReportScreen } from './report-screen'

const componentMeta: ComponentMeta<typeof ReportScreen> = {
  title: 'Report Screen',
  component: ReportScreen,
  args: {
    screenKey: 'productDetail_report',
    headlineTitleI18nKey: 'productDetail_report_screen_headline_title',
    bodyTitleI18nKey: 'productDetail_report_screen_body_title',
    footerAcceptI18nKey: 'productDetail_report_screen_footer_accept',
    footerAbortI18nKey: 'productDetail_report_screen_footer_abort',
  },
}

export default componentMeta

export const Default: ComponentStory<typeof ReportScreen> = args => (
  <ReportScreen {...args}>
    <Text>{'test'}</Text>
  </ReportScreen>
)
