import { GeoPosition } from 'react-native-geolocation-service'
import { z } from 'zod'
import { simulationCards } from '../../../screens/app/developer-settings/simulation-cards/simulation-cards'

export type EnvironmentConfigurationState = {
  currentEnvironmentName: string
}

export type OnboardingState = {
  showOnboardingOnStartup: boolean
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

export type AppCoreState = {
  appConfig?: AppConfig
  isBootstrapped?: boolean
  isInForeground?: boolean
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

export type PersistState = {
  environmentConfiguration: EnvironmentConfigurationState
  onboarding: OnboardingState
  location: LocationState
  appCore: AppCoreState
  cardSimulation: CardSimulationState
  releaseNotes: ReleaseNotesState
}
