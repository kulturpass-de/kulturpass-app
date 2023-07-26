#!/usr/bin/env ts-node
import fs from 'fs'
import yaml from 'js-yaml'
import path from 'path'
import { generateApi } from 'swagger-typescript-api'
import { EnvironmentConfigurationContent } from '../src/services/environment-configuration/environment-configuration'

const environmentConfigurationName = process.argv[2] || 'qa'

const filePath = path.resolve(process.cwd(), './src/services/environment-configuration/environment-configuration.yaml')
const environmentConfigurations = yaml.load(fs.readFileSync(filePath, 'utf-8')) as EnvironmentConfigurationContent
const environmentConfiguration = environmentConfigurations.data.find(
  currentEnvironmentConfiguration => currentEnvironmentConfiguration.name === environmentConfigurationName,
)

if (!environmentConfiguration) {
  throw new Error(`Could not find environment configuration with name "${environmentConfigurationName}"`)
}

generateApi({
  output: path.resolve(process.cwd(), './src/services/api/types/commerce'),
  name: 'api-types.ts',
  url: `${environmentConfiguration.commerce.baseUrl}/api-docs`,
  generateClient: false,
  generateRouteTypes: false,
  generateResponses: false,
})
