'use strict'

const rules = require('../rules')

function sqlInjection (options = {}) {
  const { loggerFunction = noop } = options

  return (request, response, next) => {
    // return 403 if SQL injection found
    if (rules.isSqlInjection(request.originalUrl)) {
      loggerFunction('sql-injection', {
        originalUrl: request.originalUrl
      })
      return response.sendStatus(403)
    }

    return next()
  }
}

function xss (options = {}) {
  const { loggerFunction = noop } = options

  return (request, response, next) => {
    // return 403 if XSS found
    if (rules.isXss(request.originalUrl)) {
      loggerFunction('xss', {
        originalUrl: request.originalUrl
      })
      return response.sendStatus(403)
    }

    return next()
  }
}

function noop () {}

module.exports = {
  sqlInjection,
  xss
}
