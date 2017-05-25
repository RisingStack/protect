'use strict'

const Koa = require('koa')

const app = new Koa()

app.use(async function (ctx, next) {
  const start = new Date()
  await next()
  const ms = new Date() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

app.use((ctx) => {
  ctx.body = 'Hello World'
})

app.listen(3000)
