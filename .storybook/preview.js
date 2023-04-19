import React from 'react';
import { View, StyleSheet } from 'react-native';

export const decorators = [
  StoryFn => (
    <View style={styles.container}>
      <StoryFn />
    </View>
  ),
];

export const parameters = {
  actions: { argTypesRegex: '^on.*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const styles = StyleSheet.create({
  container: { padding: 8, flex: 1 },
});
