'use strict'

const expect = require('chai').expect
const supertest = require('supertest')
const express = require('express')
const lib = require('../')

describe('The express object', () => {
  describe('using the sqlInjection middleware', () => {
    it('does not effect normal requests', (done) => {
        const app = express()
        app.use(lib.express.sqlInjection())
        app.get('/login', (req, res) => {
          res.send('ok')
        })

        supertest(app)
          .get('/login?password=some-secret')
          .expect(200)
          .end(done)
    })

    it('can block requests based on the request url', (done) => {
      const app = express()
      app.use(lib.express.sqlInjection())
      app.get('/login', (req, res) => {
        res.send('ok')
      })

      supertest(app)
        .get('/login?password=;OR 1=1')
        .expect(403)
        .end(done)
    })
    it('can block requests based on the body payload')
  })

  describe('using the xss middleware', () => {
    it('does not effect normal requests', (done) => {
        const app = express()
        app.use(lib.express.xss())
        app.get('/article', (req, res) => {
          res.send('ok')
        })

        supertest(app)
          .get('/article?content=some-content-to-be-posted')
          .expect(200)
          .end(done)
    })

    it('can block requests based on the request url', (done) => {
      const app = express()
      app.use(lib.express.xss())
      app.get('/article', (req, res) => {
        res.send('ok')
      })

      supertest(app)
        .get('/article?content=<script>')
        .expect(403)
        .end(done)
    })
    it('can block requests based on the body payload')
  })
})
