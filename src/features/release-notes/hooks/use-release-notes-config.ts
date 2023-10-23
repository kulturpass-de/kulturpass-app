import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLastDisplayedVersion } from '../redux/release-notes-selectors'
import { setLastDisplayedVersion } from '../redux/release-notes-slice'

export const useReleaseNotesConfig = () => {
  const showReleaseNotesOnAppStart = useSelector(getLastDisplayedVersion)
  const dispatch = useDispatch()

  const toggleShowReleaseNotesOnAppStart = useCallback(() => {
    dispatch(setLastDisplayedVersion(''))
  }, [dispatch])

  return { showReleaseNotesOnAppStart: !!showReleaseNotesOnAppStart, toggleShowReleaseNotesOnAppStart }
}
