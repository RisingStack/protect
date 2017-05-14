'use strict'

const protect = require('../')
const express = require('express')
const bodyParser = require('body-parser')

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

app.get('/', (request, response) => {
  response.send('hello protect!')
})

app.listen(process.env.PORT || 3000, (err) => {
  if (err) {
    return console.error('server could not start')
  }
  console.log('server is running')
})
