'use strict'

const request = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')
const redis = require('redis')

const client = redis.createClient()
const lib = require('../')

describe('The express object', () => {
  describe('using the sqlInjection middleware', () => {
    it('does not effect normal requests', () => {
      const app = express()
      app.use(lib.express.sqlInjection())
      app.get('/login', (req, res) => {
        res.send('ok')
      })

      return request(app)
        .get('/login?password=some-secret')
        .expect(200)
    })

    it('can block requests based on the request url', () => {
      const app = express()
      app.use(lib.express.sqlInjection())
      app.get('/login', (req, res) => {
        res.send('ok')
      })

      return request(app)
        .get('/login?password=;OR 1=1')
        .expect(403)
    })

    it('can block requests based on the body payload', () => {
      const app = express()
      app.use(bodyParser.urlencoded({
        extended: true
      }))
      app.use(lib.express.sqlInjection({
        body: true
      }))
      app.post('/login', (req, res) => {
        res.send('ok')
      })

      return request(app)
        .post('/login')
        .type('form')
        .send({
          password: 'passowrd\' OR 1=1'
        })
        .expect(403)
    })
  })

  describe('using the xss middleware', () => {
    it('does not effect normal requests', () => {
      const app = express()
      app.use(lib.express.xss())
      app.get('/article', (req, res) => {
        res.send('ok')
      })

      return request(app)
        .get('/article?content=some-content-to-be-posted')
        .expect(200)
    })

    it('can block requests based on the request url', () => {
      const app = express()
      app.use(lib.express.xss())
      app.get('/article', (req, res) => {
        res.send('ok')
      })

      return request(app)
        .get('/article?content=<script>')
        .expect(403)
    })

    it('can block requests based on the body payload', () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(lib.express.xss({
        body: true
      }))
      app.post('/login', (req, res) => {
        res.send('ok')
      })

      return request(app)
        .post('/login')
        .send({
          password: '<script>'
        })
        .expect(403)
    })
  })

  describe('together the xss and sqlInjection middleware', () => {
    it('works', () => {
      const app = express()
      app.use(bodyParser.json())
      app.use(lib.express.xss({
        body: true
      }))
      app.use(lib.express.sqlInjection({
        body: true
      }))
      app.post('/login', (req, res) => {
        res.send('ok')
      })

      return request(app)
        .post('/login')
        .send({
          password: '<script>'
        })
        .expect(403)
    })
  })

  describe('the ratelimiter', () => {
    it('adds the rate-limiter headers', () => {
      const app = express()
      app.use(lib.express.rateLimiter({
        db: client,
        id: () => Math.floor(Math.random() * 10000)
      }))
      app.get('/', (req, res) => {
        res.send('ok')
      })

      return request(app)
        .get('/')
        .expect(200)
        .expect('RateLimit-Limit', '2500')
        .expect('RateLimit-Remaining', '2499')
    })

    it('returns with 429 if ratelimited', () => {
      const app = express()
      const identifier = Math.floor(Math.random() * 10000)
      app.use(lib.express.rateLimiter({
        db: client,
        id: () => identifier,
        max: 1,
      }))
      app.get('/', (req, res) => {
        res.send('ok')
      })

      return request(app)
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
