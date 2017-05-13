'use strict'

const rules = require('../rules')

function noop () {}

function sqlInjection (options) {
  options = options || {}
  const loggerFunction = options.loggerFunction || noop

  return function (request, response, next) {
    // return 403 if sql injection found
    if (rules.isSqlInjection(request.originalUrl)) {
      loggerFunction('sql-injection', {
        originalUrl: request.originalUrl
      })
      return response.status(403).send('SQL injection detected')
    }

    return next()
  }
}

function xss (options) {
  options = options || {}
  const loggerFunction = options.loggerFunction || noop

  return function (request, response, next) {
    if (rules.isXss(request.originalUrl)) {
      loggerFunction('xss', {
        originalUrl: request.originalUrl
      })
      return response.status(403).send('XSS detected')
    }
    return next()
  }
}

module.exports = {
  sqlInjection,
  xss
}
