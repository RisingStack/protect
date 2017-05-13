'use strict'

/*
sql regex reference - taken from symantec
http://www.symantec.com/connect/articles/detection-sql-injection-and-cross-site-scripting-attacks
*/

const xssSimple = new RegExp('((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)', 'i')
const xssImgSrc = new RegExp('((\%3C)|<)((\%69)|i|(\%49))((\%6D)|m|(\%4D))((\%67)|g|(\%47))[^\n]+((\%3E)|>)', 'i')

function isXss (value) {
  if (xssSimple.test(value) || xssImgSrc.test(value)) {
    return true
  }

  return false
}

module.exports = isXss
