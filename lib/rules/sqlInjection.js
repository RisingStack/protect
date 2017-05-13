'use strict'

/*
sql regex reference - taken from symantec
http://www.symantec.com/connect/articles/detection-sql-injection-and-cross-site-scripting-attacks
*/

const sql = new RegExp('w*((%27)|(\'))((%6F)|o|(%4F))((%72)|r|(%52))', 'i')
const sqlMeta = new RegExp('(%27)|(\')|(--)|(%23)|(#)', 'i')
const sqlMetaVersion2 = new RegExp('((%3D)|(=))[^\n]*((%27)|(\')|(--)|(%3B)|(;))', 'i')
const sqlUnion = new RegExp('((%27)|(\'))union', 'i')

function isSqlInjection (value) {
  if (sql.test(value) || sqlMeta.test(value) || sqlMetaVersion2.test(value) || sqlUnion.test(value)) {
    return true
  }

  return false
}

module.exports = isSqlInjection
