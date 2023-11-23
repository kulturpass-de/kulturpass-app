import * as RN from 'react-native';

RN.Animated.timing = () => ({
  start: () => jest.fn(),
});

RN.Animated.loop = () => ({
  start: () => jest.fn(),
});

RN.Animated.createTimer = () => jest.fn();

module.exports = RN;
