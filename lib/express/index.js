'use strict'

const debug = require('debug')('@risingstack/protect:express')
const rules = require('../rules')

function getBodyAsString (request) {
  request._protect = request._protect || {}
  if (request.is('json') || request.is('urlencoded')) {
    try {
      request._protect.body = JSON.stringify(request.body)
    } catch (ex) {
      debug('error stringifying body')
    }
  } else {
    request._protect.body = request.body
  }

  return request._protect.body
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
      const body = getBodyAsString(request)
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
      const body = getBodyAsString(request)
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
