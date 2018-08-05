// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import { ApiResult } from './api'
import 'isomorphic-fetch'

interface Settings {
  [key: string]: string
  host: string
  port: string
  operator: string
  operator_pass: string
  company: string
  company_pass: string
}

export default class Syspro {
  settings: Settings

  constructor(settings: Settings) {
    if (!settings.host) {
      throw new Error('No host was defined.')
    }
    if (!settings.port) {
      throw new Error('No port was defined.')
    }
    if (!settings.operator) {
      throw new Error('No operator was defined.')
    }
    if (!settings.company) {
      throw new Error('No company was defined.')
    }

    this.settings = settings
  }

  public async authenticate(): Promise<ApiResult<string>> {
    let queryParams = Object.keys(this.settings)
      .map(p => encodeURIComponent(p) + '=' + encodeURIComponent(this.settings[p]))
      .join('&')

    try {
      const resp = await fetch('http://server.com', {})
      if (!resp.ok) {
        return {
          type: 'failure',
          ok: false,
          error: {
            detail: 'There was a problem connecting to the Syspro service.',
            title: 'Unable to connect to Syspro.'
          }
        }
      }

      return {
        type: 'success',
        ok: true,
        value: 'sup'
      }
    } catch (e) {
      return {
        type: 'failure',
        ok: false,
        error: {
          detail: e.message,
          title: 'Unable to authenticate with Syspro.'
        }
      }
    }
  }
}
