import Syspro from '../src/sysprojs'
import 'isomorphic-fetch'
import fetchMock from 'fetch-mock'
import { Exception } from 'handlebars'

/**
 * Dummy test
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
    })

    it('fails authentication with bad credentials', async () => {
      fetchMock.mock('http://server.com', 500)
      let resp = await syspro.authenticate()

      expect(resp.ok).toBe(false)
      expect(resp.type).toEqual('failure')
    })

    it('passes authentication with valid credentials', async () => {
      fetchMock.mock('http://server.com', 200)
      let resp = await syspro.authenticate()

      expect(resp.ok).toBe(true)
      expect(resp.type).toEqual('success')
    })

    it('catches exceptions', async () => {
      fetchMock.mock('http://server.com', { throws: Error('Error! Error!') })
      let resp = await syspro.authenticate()

      expect(resp.ok).toBe(false)
      expect(resp.type).toEqual('failure')
    })
  })
})
