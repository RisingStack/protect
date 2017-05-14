'use strict'

const request = require('supertest')
const express = require('express')
const bodyParser = require('body-parser')

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

  describe('together', () => {
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
})
