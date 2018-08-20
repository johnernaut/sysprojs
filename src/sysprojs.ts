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
  token: string = ''

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
    try {
      const resp = await fetch(this.logonQuery())

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

      return this.parseLogonResponse(await resp.text())
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

  baseUrl(): string {
    return `${this.settings.host}:${this.settings.port}/sysprowcfservice/rest`
  }

  logonQuery(): string {
    let paramString = `/Logon?Operator=${this.settings.operator}&OperatorPassword=${
      this.settings.operator_pass
    }`
    if (this.settings.company_pass) paramString += `&CompanyPassword=${this.settings.company_pass}`

    return this.baseUrl() + paramString
  }

  private parseLogonResponse(response: string): ApiResult<string> {
    if (response.includes('ERROR')) {
      return {
        type: 'failure',
        ok: false,
        error: {
          detail: response,
          title: 'There was a problem logging in to Syspro.'
        }
      }
    }

    this.token = response.trim()

    return {
      type: 'success',
      ok: true,
      value: this.token
    }
  }
}
