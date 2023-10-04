import { Notification } from '@notifee/react-native'
import { GeoPosition } from 'react-native-geolocation-service'
import { z } from 'zod'
import { simulationCards } from '../../../screens/app/developer-settings/simulation-cards/simulation-cards'
import { CommerceApiEndpointCache, CommerceApiEndpointName } from '../../api/redux/types'

export type EnvironmentConfigurationState = {
  currentEnvironmentName: string
}

export type OnboardingState = {
  showOnboardingOnStartup: boolean
  notificationOnboardingShown?: boolean
}

export type LocationState = {
  currentUserLocation: GeoPosition | undefined
}

export const AppConfigSchema = z.object({
  appVersions: z.object({
    min: z.string(),
  }),
  eid: z.object({
    tcTokenUrlSubdomains: z.array(z.string()),
  }),
})

export type AppConfig = z.infer<typeof AppConfigSchema>

export type PersistedAppCoreState = {
  appConfig?: AppConfig
  isBootstrapped?: boolean
  lastUsedTranslationLanguage?: string
}

export type CardSimulationState = {
  simulateCard: boolean
  simulatedCardName?: keyof typeof simulationCards
  simulatedCardDate?: string
  randomLastName?: boolean
}

export type ReleaseNotesState = {
  lastDisplayedVersion: string
}

export type ApiOfflineCacheState = {
  commerceApi: {
    [endpointName in CommerceApiEndpointName]?:
      | {
          [cacheKey in string]: CommerceApiEndpointCache<endpointName>
        }
      | undefined
  }
}

export type InAppReviewState = {
  lastShownTimestamp?: number
}

export type NotificationsState = {
  fcmToken?: string
  apnsToken?: string
  previousFcmToken?: string
  backgroundPressedNotification?: Notification
}

export type PersistState = {
  environmentConfiguration: EnvironmentConfigurationState
  onboarding: OnboardingState
  location: LocationState
  persistedAppCore: PersistedAppCoreState
  cardSimulation: CardSimulationState
  releaseNotes: ReleaseNotesState
  apiOfflineCache: ApiOfflineCacheState
  inAppReview: InAppReviewState
  notifications: NotificationsState
}
