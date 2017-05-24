'use strict'

const debug = require('debug')('@risingstack/protect:express')
const Limiter = require('ratelimiter')
const helmet = require('helmet')
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

function rateLimiter (options = {}) {
  const { loggerFunction = noop } = options

  if (!options.db) {
    throw new Error('options.db is required')
  }

  if (!options.id) {
    throw new Error('options.id is required')
  }

  return (request, response, next) => {
    const limiter = new Limiter({
      db: options.db,
      id: options.id(request),
      max: options.max,
      duration: options.duration
    })

    limiter.get((err, limit) => {
      if (err) {
        loggerFunction('ratelimiter-error', err)
        return next(err)
      }

      response.set('RateLimit-Limit', limit.total)
      response.set('RateLimit-Remaining', limit.remaining - 1)
      response.set('RateLimit-Reset', limit.reset)

      if (limit.remaining) {
        return next()
      }

      const after = Math.floor(limit.reset - (Date.now() / 1000))
      response.set('Retry-After', after)
      response.sendStatus(429)

      return next()
    })
  }
}

function noop () {}

module.exports = {
  sqlInjection,
  xss,
  rateLimiter,
  headers: helmet,
  helmet
}
