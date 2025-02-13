import yaml from 'js-yaml'
import { z } from 'zod'
import { env } from '../../env'
import { logger } from '../../services/logger'
import { LocalizedLinkSchema } from '../../utils/links/hooks/use-localized-environment-url'
import environmentConfigurationFileContent from './environment-configuration.yaml'

export const AuthSchema = z.object({
  tokenEndpoint: z.string(),
  revocationEndpoint: z.string(),
  clientId: z.string(),
  clientSecret: z.string(),
})

export type Auth = z.infer<typeof AuthSchema>

export const AppInformationSchema = z.object({
  imprintUrl: LocalizedLinkSchema,
  openSourceLegalNoticeUrl: LocalizedLinkSchema,
})

export type AppInformation = z.infer<typeof AppInformationSchema>

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
    dpsDocumentUrl: LocalizedLinkSchema,
    eulaDocumentUrl: LocalizedLinkSchema,
  }),
})

export type CustomerDataCloud = z.infer<typeof CustomerDataCloudSchema>

export const EidSchema = z.object({
  tcTokenUrl: z.string(),
  tcTokenUrlDefaultSubdomain: z.string(),
})

export type Eid = z.infer<typeof EidSchema>

export const FaqSchema = z.object({
  homeUrl: LocalizedLinkSchema,
})

export type Faq = z.infer<typeof FaqSchema>

export const AppConfigSchema = z.object({
  initialValue: z.string(),
  publicKey: z.string(),
  backupPublicKey: z.string(),
  url: z.string(),
  enableBudgetVoucher: z.boolean().optional(),
  voucherCampaigns: z
    .object({
      enableProfileEntry: z.boolean().optional(),
    })
    .optional(),
})

export type AppConfig = z.infer<typeof AppConfigSchema>

export const BankIdSchema = z.object({
  loginUrl: z.string(),
})

export type BankId = z.infer<typeof BankIdSchema>

export const EnvironmentConfigurationSchema = z.object({
  name: z.string(),
  appInformation: AppInformationSchema,
  commerce: CommerceApiSchema,
  cdc: CustomerDataCloudSchema,
  eid: EidSchema,
  faq: FaqSchema,
  appConfig: AppConfigSchema,
  bankId: BankIdSchema,
})

export type EnvironmentConfiguration = z.infer<typeof EnvironmentConfigurationSchema>

export const EnvironmentConfigurationContentSchema = z.object({
  $schema: z.string(),
  // At least one environment configuration must be available
  data: z.array(EnvironmentConfigurationSchema).refine(data => data.length > 0),
})

export type EnvironmentConfigurationContent = z.infer<typeof EnvironmentConfigurationContentSchema>

const readEnvironmentConfiguration = (): EnvironmentConfigurationContent => {
  let environmentConfiguration: unknown
  if (env.ENVIRONMENTS !== undefined) {
    if (__DEV__ && process.env.NODE_ENV !== 'test') {
      logger.log('Using ENVIRONMENTS env variable to read environment configuration')
    }
    environmentConfiguration = JSON.parse(env.ENVIRONMENTS)
  } else {
    if (__DEV__) {
      logger.log('Using environment-configuration.yaml to read environment configuration')
    }
    environmentConfiguration = yaml.load(environmentConfigurationFileContent)
  }

  return EnvironmentConfigurationContentSchema.parse(environmentConfiguration)
}

export const environmentConfigurations = readEnvironmentConfiguration()
