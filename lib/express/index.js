'use strict'

const rawbody = require('raw-body')
const rules = require('../rules')

function sqlInjection (options = {}) {
  const { loggerFunction = noop } = options

  return (request, response, next) => {
    request._protect = request._protect || {}
    // return 403 if SQL injection found
    if (rules.isSqlInjection(request.originalUrl)) {
      loggerFunction('sql-injection', {
        originalUrl: request.originalUrl
      })
      return response.sendStatus(403)
    }

    if (options.body) {
      if (request._protect.body) {
        if (rules.isXss(request._protect.body)) {
          loggerFunction('xss', {
            body: request._protect.body
          })
          return response.sendStatus(403)
        }
        return next()
      }
      return rawbody(request, Object.assign({}, options.body, {
        encoding: 'utf-8'
      }))
      .then((body) => {
        request._protect.body = body
        if (rules.isSqlInjection(body)) {
          loggerFunction('sql-injection', {
            body
          })
          return response.sendStatus(403)
        }
        return next()
      })
      .catch((error) => {
        next(error)
      })
    }

    return next()
  }
}

function xss (options = {}) {
  const { loggerFunction = noop } = options

  return (request, response, next) => {
    request._protect = request._protect || {}
    // return 403 if XSS found
    if (rules.isXss(request.originalUrl)) {
      loggerFunction('xss', {
        originalUrl: request.originalUrl
      })
      return response.sendStatus(403)
    }

    if (options.body) {
      if (request._protect.body) {
        if (rules.isXss(request._protect.body)) {
          loggerFunction('xss', {
            body: request._protect.body
          })
          return response.sendStatus(403)
        }
        return next()
      }
      return rawbody(request, Object.assign({}, options.body, {
        encoding: 'utf-8'
      }))
      .then((body) => {
        request._protect.body = body
        if (rules.isXss(body)) {
          loggerFunction('xss', {
            body
          })
          return response.sendStatus(403)
        }
        return next()
      })
      .catch((error) => {
        next(error)
      })
    }

    return next()
  }
}

function noop () {}

module.exports = {
  sqlInjection,
  xss
}
