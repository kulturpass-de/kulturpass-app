import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { getLastDisplayedVersion } from '../redux/release-notes-selectors'
import { ReleaseNotesModalRouteName } from '../screens/release-notes-modal-route'
import { getDisplayVersion } from '../utils/getDisplayVersion'

const currentDisplayedVersion = getDisplayVersion()

export const useDisplayReleaseNotes = () => {
  const navigation = useModalNavigation()
  const lastDisplayedVersion = useSelector(getLastDisplayedVersion)
  const dispatch = useDispatch()

  useEffect(() => {
    if (lastDisplayedVersion !== currentDisplayedVersion) {
      navigation.navigate({ screen: ReleaseNotesModalRouteName })
    }
  }, [lastDisplayedVersion, navigation, dispatch])
}
