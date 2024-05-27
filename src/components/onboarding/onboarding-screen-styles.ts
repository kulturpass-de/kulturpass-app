import { StyleSheet } from 'react-native'
import { spacing } from '../../theme/spacing'

export const onboardingScreenStyles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    textAlign: 'center',
    alignItems: 'stretch',
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
    flexDirection: 'column',
  },
  contentTitle: {
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  contentText: {
    paddingTop: spacing[6],
    flexWrap: 'wrap',
  },
  buttonSpacer: {
    height: 48,
  },
})
