import { z } from 'zod'
import { LocalizedLinkSchema } from '../../utils/links/hooks/use-localized-environment-url'
import FAQConfigJSON from './faq-configuration.json'

export const FAQConfigurationSchema = z.object({
  $schema: z.string(),
  data: z.object({
    entries: z
      .record(z.string().regex(/^[A-Z0-9-_]+$/), LocalizedLinkSchema)
      .and(z.object({ DEFAULT: LocalizedLinkSchema })),
  }),
})

export type FAQConfiguration = z.infer<typeof FAQConfigurationSchema>

export const faqConfiguration = FAQConfigurationSchema.parse(FAQConfigJSON)
