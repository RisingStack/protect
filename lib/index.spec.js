'use strict'

const expect = require('chai').expect
const lib = require('../')

describe('The module', () => {
  it('exposes an express object', () => {
    expect(lib).to.have.property('express')
  })

  it('exposes the ruleset', () => {
    expect(lib).to.have.property('rules')
  })
})
