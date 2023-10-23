import { ComponentMeta, ComponentStory } from '@storybook/react-native'
import React from 'react'
import { ProductReportBody } from './product-report-body'

const componentMeta: ComponentMeta<typeof ProductReportBody> = {
  title: 'Report Body',
  component: ProductReportBody,
}

export default componentMeta

export const Default: ComponentStory<typeof ProductReportBody> = () => <ProductReportBody />
