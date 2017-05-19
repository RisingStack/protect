'use strict'

const protect = require('../')
const express = require('express')
const bodyParser = require('body-parser')
const redis = require('redis')

const client = redis.createClient()

const app = express()

app.use(bodyParser.json({
  extended: false
}))

app.use(protect.express.sqlInjection({
  body: true,
  loggerFunction: console.error
}))

app.use(protect.express.xss({
  body: true,
  loggerFunction: console.error
}))

app.use(protect.express.rateLimiter({
  db: client,
  id: (request) => request.connection.remoteAddress
}))

app.get('/', (request, response) => {
  response.send('hello protect!')
})

app.get('/some-page', protect.express.rateLimiter({
  db: client,
  id: (request) => request.connection.remoteAddress,
  max: 10
}), (request, response) => {
  response.send('ok')
})

app.post('/login', protect.express.rateLimiter({
  db: client,
  id: (request) => request.body.email
}), (request, response) => {
  response.send('wuut logged in')
})

app.listen(process.env.PORT || 3000, (err) => {
  if (err) {
    return console.error('server could not start')
  }
  console.log('server is running')
})
