'use strict'

const bench = require('fastbench')
const traverse = require('traverse')
const regex = /aaa/

const run = bench([
  function JSONStrinfify (done) {
    const obj = {
      a: 1,
      b: 2,
      c: 4224,
      d: 'eeeeeeeew'
    }
    const stringified = JSON.stringify(obj)
    regex.test(stringified)
    done()
  },
  function propertyIteration (done) {
    const obj = {
      a: 1,
      b: 2,
      c: 4224,
      d: 'eeeeeeeew'
    }

    traverse(obj).forEach((x) => {
      if (typeof x === 'string') {
        regex.test(x)
      }
    })

    done()
  }
], 1000)

run(run)
