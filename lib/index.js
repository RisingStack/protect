'use strict'

const debug = require('debug')('@risingstack/protect:main')
const express = require('./express')
const rules = require('./rules')

let koa

try {
  // eslint-disable-next-line
  koa = require('./koa')
} catch (ex) {
  debug(ex)
}

module.exports = {
  express,
  koa,
  rules
}
