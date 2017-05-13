'use strict'

const isSqlInjection = require('./sqlInjection')
const isXss = require('./xss')

module.exports = {
  isSqlInjection,
  isXss
}
