import { getStorybookUI } from '@storybook/react-native'

import './storybook.requires'

const StorybookUIRoot = getStorybookUI({
  shouldPersistSelection: true,
})

export default StorybookUIRoot
