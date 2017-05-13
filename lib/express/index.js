'use strict'

const rules = require('../rules')

function noop () {}

function sqlInjection (options) {
  const loggerFunction = options.loggerFunction || noop

  return function (request, response, next) {
    // return 403 if sql injection found
    if (rules.isSqlInjection(request.originalUrl)) {
      loggerFunction('sql-injection', {
        originalUrl: request.originalUrl
      })
      response.status(403).send('SQL injection detected')
    }

    return next()
  }
}

module.exports = {
  sqlInjection
}
