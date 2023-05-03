import { z } from 'zod'
import yaml from 'js-yaml'
import environmentConfigurationFileContent from './environment-configuration.yaml'
import { env } from '../../env'

export const AuthSchema = z.object({
  tokenEndpoint: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
})

export type Auth = z.infer<typeof AuthSchema>

export const CommerceApiSchema = z.object({
  baseUrl: z.string(),
  baseSiteId: z.string(),
  auth: AuthSchema,
  homeUrl: z.string(),
  searchUrl: z.string(),
})

export type CommerceApi = z.infer<typeof CommerceApiSchema>

export const CustomerDataCloudSchema = z.object({
  baseUrl: z.string(),
  apiKey: z.string(),
  consents: z.object({
    dpsDocumentUrl: z.object({
      de: z.string(),
      en: z.string(),
    }),
  }),
})

export type CustomerDataCloud = z.infer<typeof CustomerDataCloudSchema>

export const EidSchema = z.object({
  tcTokenUrl: z.string(),
})

export type Eid = z.infer<typeof EidSchema>

export const AppConfigSchema = z.object({
  initialValue: z.string(),
  publicKey: z.string(),
  backupPublicKey: z.string(),
  url: z.string(),
})

export type AppConfig = z.infer<typeof AppConfigSchema>

export const EnvironmentConfigurationSchema = z.object({
  name: z.string(),
  commerce: CommerceApiSchema,
  cdc: CustomerDataCloudSchema,
  eid: EidSchema,
  appConfig: AppConfigSchema,
})

export type EnvironmentConfiguration = z.infer<typeof EnvironmentConfigurationSchema>

export const EnvironmentConfigurationContentSchema = z.object({
  $schema: z.string(),
  data: z.array(EnvironmentConfigurationSchema),
})

export type EnvironmentConfigurationContent = z.infer<typeof EnvironmentConfigurationContentSchema>

const readEnvironmentConfiguration = (): EnvironmentConfigurationContent => {
  let environmentConfiguration: unknown
  if (env.ENVIRONMENTS !== undefined) {
    console.log('Using ENVIRONMENTS env variable to read environment configuration')
    environmentConfiguration = JSON.parse(env.ENVIRONMENTS)
  } else {
    console.log('Using environment-configuration.yaml to read environment configuration')
    environmentConfiguration = yaml.load(environmentConfigurationFileContent)
  }

  return EnvironmentConfigurationContentSchema.parse(environmentConfiguration)
}

export const environmentConfigurations = readEnvironmentConfiguration()
