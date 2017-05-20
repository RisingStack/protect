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

  describe('using the xss middleware', () => {
    it('does not effect normal requests', () => {
      const app = new Koa()

      app.use((ctx) => {
        ctx.body = 'Hello World'
      })

      return request(app.callback())
        .get('/article?content=some-content-to-be-posted')
        .expect(200)
    })

    it('can block requests based on the request url', () => {
      const app = new Koa()

      app.use((ctx) => {
        ctx.body = 'Hello World'
      })

      return request(app.callback())
        .get('/article?content=<script>')
        .expect(403)
    })

    it('can block requests based on the body payload', () => {
      const app = new Koa()

      app.use((ctx) => {
        ctx.body = 'Hello World'
      })

      return request(app.callback())
        .post('/login')
        .send({
          password: '<script>'
        })
        .expect(403)
    })
  })

  describe('together the xss and sqlInjection middleware', () => {
    it('works', () => {
      const app = new Koa()

      app.use((ctx) => {
        ctx.body = 'Hello World'
      })

      return request(app.callback())
        .post('/login')
        .send({
          password: '<script>'
        })
        .expect(403)
    })
  })

  describe('the ratelimiter', () => {
    it('adds the rate-limiter headers', () => {
      const app = new Koa()

      app.use((ctx) => {
        ctx.body = 'Hello World'
      })

      return request(app.callback())
        .get('/')
        .expect(200)
        .expect('RateLimit-Limit', '2500')
        .expect('RateLimit-Remaining', '2499')
    })

    it('returns with 429 if ratelimited', () => {
      const app = new Koa()

      app.use((ctx) => {
        ctx.body = 'Hello World'
      })

      return request(app.callback())
        .get('/')
        .expect(200)
        .expect('RateLimit-Limit', '1')
        .expect('RateLimit-Remaining', '0')
        .then(() => {
          request(app)
            .get('/')
            .expect(429)
        })
    })
  })
})
