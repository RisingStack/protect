'use strict'

const request = require('supertest')
const Koa = require('koa')

describe('The koa object', () => {
  describe('using the sqlInjection middleware', () => {
    it('does not effect normal requests', () => {
      const app = new Koa()

      app.use((ctx) => {
        ctx.body = 'Hello World'
      })

      return request(app.callback())
        .get('/login?password=some-secret')
        .expect(200)
    })

    it('can block requests based on the request url', () => {
      const app = new Koa()

      app.use((ctx) => {
        ctx.body = 'Hello World'
      })

      return request(app.callback())
        .get('/login?password=;OR 1=1')
        .expect(403)
    })
  })
})
