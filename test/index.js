'use strict'

const request = require('supertest')
const express = require('express')

const lib = require('../lib')

const app = express()

app.use(lib.express.sqlInjection({
  loggerFunction: console.log
}))

app.get('/user', (req, res) => {
  res.status(200).json({ name: 'tobi' })
})

request(app)
  .get('/user')
  .expect('Content-Type', /json/)
  .expect('Content-Length', '15')
  .expect(200)
  .end((err) => {
    if (err) throw err
  })
