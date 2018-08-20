import Syspro from '../src/sysprojs'
import 'isomorphic-fetch'
import fetchMock from 'fetch-mock'
import { Exception } from 'handlebars'

/**
 * Syspro tests
 */
describe('Syspro test', () => {
  describe('initialization', () => {
    it('succeeds when all parameters are present', () => {
      expect(
        new Syspro({
          host: 'test.com',
          port: '20000',
          operator: 'Bob',
          operator_pass: null,
          company: 'A',
          company_pass: null
        })
      ).toBeInstanceOf(Syspro)
    })

    it('errors when parameters are missing', () => {
      ;['host', 'port', 'operator', 'company'].forEach(val => {
        expect(() => {
          let syspro = new Syspro({
            host: val === 'host' ? null : 'http://test.com',
            port: val === 'port' ? null : '20000',
            operator: val === 'operator' ? null : 'Bob',
            operator_pass: null,
            company_pass: null,
            company: val === 'company' ? null : 'A'
          })
        }).toThrowError(`No ${val} was defined.`)
      })
    })
  })

  describe('authentication', () => {
    let syspro: Syspro
    let url: string
    afterEach(fetchMock.restore)
    beforeEach(() => {
      syspro = new Syspro({
        host: 'http://test.com',
        port: '20000',
        operator: 'bob',
        operator_pass: null,
        company_pass: null,
        company: 'A'
      })
      url = syspro.logonQuery()
    })

    it('fails authentication with bad credentials', async () => {
      fetchMock.mock(url, { body: 'ERROR: Invalid credentials' })
      let resp = await syspro.authenticate()

      expect(resp.ok).toBe(false)
      expect(resp.type).toEqual('failure')
    })

    it('passes authentication and sets token with valid credentials', async () => {
      const token = 'SDFLKJEJDSFLKJSDFI33   '
      fetchMock.mock(url, { body: token })
      let resp = await syspro.authenticate()

      expect(resp.ok).toBe(true)
      expect(resp.type).toEqual('success')
      expect(syspro.token).toEqual(token.trim())
    })

    it('fails when the server doesnt respond properly', async () => {
      fetchMock.mock(url, 500)
      let resp = await syspro.authenticate()

      expect(resp.ok).toBe(false)
      expect(resp.type).toEqual('failure')
    })

    it('catches exceptions', async () => {
      fetchMock.mock(url, { throws: Error('Error! Error!') })
      let resp = await syspro.authenticate()

      expect(resp.ok).toBe(false)
      expect(resp.type).toEqual('failure')
    })

    it('includes companypass when present', () => {
      syspro.settings.company_pass = '1234'

      expect(syspro.logonQuery()).toContain('CompanyPassword')
    })
  })
})
