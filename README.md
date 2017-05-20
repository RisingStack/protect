## Protect by RisingStack

[![Build Status](https://travis-ci.org/RisingStack/protect.svg?branch=master)](https://travis-ci.org/RisingStack/protect)

*Works on Node.js v6 and newer.*

The purpose of this module is to provide out-of-box, proactive protection for common security problems, like
SQL injection attacks or XSS attacks.

![protect by risingstack](https://blog-assets.risingstack.com/2017/05/lock.png)

Once the module recognizes an attack pattern, it won't let the request go through.

This is not a substitute for parameterized queries in SQL - just an extra layer of security.

### Basic usage

```bash
npm i @risingstack/protect --save
```

#### With Express

```javascript
const protect = require('@risingstack/protect')
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

app.post('/login', protect.express.rateLimiter({
  db: client,
  id: (request) => request.body.email,
  // max 10 tries per 2 minutes
  max: 10,
  duration: 120000
}), (request, response) => {
  response.send('wuut logged in')
})

app.listen(3000)
```

### API

#### `protect.express.sqlInjection([options])`

Returns an Express middleware, which checks for SQL injections.

* `options.body`: if this options is set (`true`), the middleware will check for request bodies as well
  * default: `false`
  * prerequisite: you must have the [body-parser](https://github.com/expressjs/body-parser) module used before adding the protect middleware
* `options.loggerFunction`: you can provide a logger function for the middleware to log attacks
  * default: `noop`

#### `protect.express.xss([options])`

Returns an Express middleware, which checks for XSS attacks.

* `options.body`: if this options is set (`true`), the middleware will check for request bodies
  * default: `false`
  * prerequisite: you must have the [body-parser](https://github.com/expressjs/body-parser) module used before adding the protect middleware
* `options.loggerFunction`: you can provide a logger function for the middleware to log attacks
  * default: `noop`

#### `protect.express.rateLimiter([options])`

Returns an Express middleware, which ratelimits

* `options.id`: function that returns the id used for ratelimiting - gets the `request` as its' first parameter
  * required
  * example: `(request) => request.connection.remoteAddress`
* `options.db`: redis connection instance
  * required
* `options.max`: max requests within `options.duration`
  * default: 2500
* `options.max`: of limit in milliseconds
  * default: 3600000
* `options.loggerFunction`: you can provide a logger function for the middleware to log attacks
  * default: `noop`

### Roadmap

* block security scanners
* schell / code injection protection
* [what would you add?](https://github.com/RisingStack/protect/issues)
