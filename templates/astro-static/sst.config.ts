import { AstroSite } from 'sst/constructs'
import type { SSTConfig } from 'sst'
import { Tags } from 'aws-cdk-lib'
import 'dotenv/config'

const SITE_HOST = process.env.VITE_SITE_HOST ?? ''

export default {
  config(_input) {
    return {
      name: 'astro-sst-template-static',
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

    app.stack(function Site({ stack }) {
      const site = new AstroSite(stack, 'astro-sst-static', {
        customDomain: {
          domainName: `${app.stage}.${SITE_HOST}`,
          hostedZone: SITE_HOST
        }
      })
      stack.addOutputs({
        url: site.customDomainUrl
      })
    })
  }
} satisfies SSTConfig