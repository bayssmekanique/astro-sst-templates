import { AstroSite } from 'sst/constructs'
import type { SSTConfig } from 'sst'
import { Tags } from 'aws-cdk-lib'

const STAGE = 'hybrid'
const SITE_HOST = process.env.SITE_HOST ?? ''
const SITE_DOMAIN = `astro-${STAGE}.${SITE_HOST}`
const SITE_URL = `https://${SITE_DOMAIN}`

export default {
  config(_input) {
    return {
      name: 'astro-templates',
      stage: STAGE,
      region: 'us-west-2',
      profile: 'sst',
      bootstrap: {
        tags: {
          'Cost Center': 'Shared',
          Environment: 'Production',
          IaC: 'SST',
          Stack: 'IaC SST'
        }
      }
    }
  },
  stacks(app) {
    Tags.of(app).add('Cost Center', 'Personal')
    Tags.of(app).add('Environment', 'Development')
    Tags.of(app).add('IaC', 'SST')
    Tags.of(app).add('Stack', 'Astro + SST Templates')

    app.setDefaultRemovalPolicy('destroy')

    app.stack(function Site({ stack }) {
      const site = new AstroSite(stack, `astro-${STAGE}`, {
        memorySize: '128 MB',
        customDomain: {
          domainName: SITE_DOMAIN,
          hostedZone: SITE_HOST
        },
        environment: {
          VITE_SITE_URL: SITE_URL,
          SECRET_KEY: 'secret-key',
          VITE_KEY: 'vite-key',
          PUBLIC_KEY: 'public-key'
        }
      })
      stack.addOutputs({
        url: site.customDomainUrl
      })
    })
  }
} satisfies SSTConfig
