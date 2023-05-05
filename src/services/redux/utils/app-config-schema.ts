import { z } from 'zod'

export const AppConfigSchema = z.object({
  appVersions: z.object({
    min: z.string(),
  }),
  certificates: z.object({
    cdc: z.array(z.object({ fingerprint256: z.string() })),
    commerce: z.array(z.object({ fingerprint256: z.string() })),
  }),
})
