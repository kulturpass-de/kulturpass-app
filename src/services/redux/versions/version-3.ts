import { Notification } from '@notifee/react-native'
import { z } from 'zod'
import { simulationCards } from '../../../screens/app/developer-settings/simulation-cards/simulation-cards'
import { CommerceApiEndpointPayload, CommerceApiEndpointName } from '../../api/redux/types'

export type EnvironmentConfigurationState = {
  currentEnvironmentName: string
}

export type OnboardingState = {
  showOnboardingOnStartup: boolean
  notificationOnboardingShown?: boolean
}

export type DeltaOnboardingState = {
  showEditorialEmailModalOnStartup?: boolean
  deltaPushNotificationsOnboardingShown?: boolean
  shouldShowDeltaOnboardingPushNotification?: boolean
  userDismissed?: boolean
}

export const AppConfigSchema = z.object({
  appVersions: z.object({
    min: z.string(),
  }),
  eid: z.object({
    tcTokenUrlSubdomains: z.array(z.string()),
  }),
  disableIdentification: z.boolean().optional(),
  enableBudgetVoucher: z.boolean().optional(),
  enableBankId: z.boolean().optional(),
  bankId: z
    .object({
      enableBeta: z.boolean().optional(),
    })
    .optional(),
  voucherCampaigns: z
    .object({
      enableProfileEntry: z.boolean().optional(),
    })
    .optional(),
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
          [cacheKey in string]: CommerceApiEndpointPayload<endpointName>
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
  deltaOnboarding: DeltaOnboardingState
  persistedAppCore: PersistedAppCoreState
  cardSimulation: CardSimulationState
  releaseNotes: ReleaseNotesState
  apiOfflineCache: ApiOfflineCacheState
  inAppReview: InAppReviewState
  notifications: NotificationsState
}
