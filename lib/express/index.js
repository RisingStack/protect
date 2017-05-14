'use strict'

const rules = require('../rules')

function getBodyAsString (body) {
  if (typeof body === 'object') {
    return JSON.stringify(body)
  } else if (Buffer.isBuffer(body)) {
    return body.toString('utf-8')
  }

  return body
}

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

    if (options.body) {
      const body = getBodyAsString(request.body)

      if (rules.isSqlInjection(body)) {
        loggerFunction('sql-injection', {
          body
        })
        return response.sendStatus(403)
      }
      return next()
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

    if (options.body) {
      const body = getBodyAsString(request.body)
      if (rules.isXss(body)) {
        loggerFunction('xss', {
          body
        })
        return response.sendStatus(403)
      }
    }

    return next()
  }
}

function noop () {}

module.exports = {
  sqlInjection,
  xss
}
