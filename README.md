## Protect by RisingStack

[![Build Status](https://travis-ci.org/RisingStack/protect.svg?branch=master)](https://travis-ci.org/RisingStack/protect)

*Works on Node.js v6 and newer.*

The purpose of this module is to provide out-of-box, proactive protection for common security problems, like
SQL injection attacks, XSS attacks, brute force, etc...

*This module is not a silver bullet, and is not a substitute for security-minded engineering work. But it can help you to achieve your goals.*

![protect by risingstack](https://blog-assets.risingstack.com/2017/05/lock.png)

### Basic usage

```bash
npm i @risingstack/protect --save
```

#### With Express

```javascript
const protect = require('@risingstack/protect')
const express = require('express')
const bodyParser = require('body-parser')
const redis = require('redis')

const client = redis.createClient()

const app = express()

app.use(bodyParser.json({
  extended: false
}))

app.use(protect.express.sqlInjection({
  body: true,
  loggerFunction: console.error
}))

app.use(protect.express.xss({
  body: true,
  loggerFunction: console.error
}))

app.use(protect.express.rateLimiter({
  db: client,
  id: (request) => request.connection.remoteAddress
}))

app.get('/', (request, response) => {
  response.send('hello protect!')
})

app.post('/login', protect.express.rateLimiter({
  db: client,
  id: (request) => request.body.email,
  // max 10 tries per 2 minutes
  max: 10,
  duration: 120000
}), (request, response) => {
  response.send('wuut logged in')
})

app.listen(3000)
```

### API

#### `protect.express.sqlInjection([options])`

Returns an Express middleware, which checks for SQL injections.

* `options.body`: if this options is set (`true`), the middleware will check for request bodies as well
  * default: `false`
  * prerequisite: you must have the [body-parser](https://github.com/expressjs/body-parser) module used before adding the protect middleware
* `options.loggerFunction`: you can provide a logger function for the middleware to log attacks
  * default: `noop`

#### `protect.express.xss([options])`

Returns an Express middleware, which checks for XSS attacks.

* `options.body`: if this options is set (`true`), the middleware will check for request bodies
  * default: `false`
  * prerequisite: you must have the [body-parser](https://github.com/expressjs/body-parser) module used before adding the protect middleware
* `options.loggerFunction`: you can provide a logger function for the middleware to log attacks
  * default: `noop`

#### `protect.express.rateLimiter([options])`

Returns an Express middleware, which ratelimits

* `options.id`: function that returns the id used for ratelimiting - gets the `request` as its' first parameter
  * required
  * example: `(request) => request.connection.remoteAddress`
* `options.db`: redis connection instance
  * required
* `options.max`: max requests within `options.duration`
  * default: 2500
* `options.max`: of limit in milliseconds
  * default: 3600000
* `options.loggerFunction`: you can provide a logger function for the middleware to log attacks
  * default: `noop`

### Roadmap

* block security scanners
* schell / code injection protection
* [what would you add?](https://github.com/RisingStack/protect/issues)

### Security Recommendations

As mentioned, this module isn't a silver bullet to solve your security issues completely.  The following information is provided to hopefully point you in the right direction for solving other security concerns or alternatives that may be useful based on your budget or scale.

#### Other Aspects

There are plenty of other areas that you should be concerned about when it comes to security, that this module doesn't cover (yet or won't) for various reasons.  Here are a few that are worth researching:

* [Password Hashing](https://www.owasp.org/index.php/Password_Storage_Cheat_Sheet)
  * Bcrypt modules: [bcrypt](https://www.npmjs.com/package/bcrypt),[bcryptjs](https://www.npmjs.com/package/bcryptjs), [bcrypt-as-promised](https://www.npmjs.com/package/bcrypt-as-promised) 
  * Scrypt modules: [scrypt](https://www.npmjs.com/package/scrypt), [scryptsy](https://www.npmjs.com/package/scryptsy), [scrypt-async](https://www.npmjs.com/package/scrypt-async)
* [NoSQL Injection](https://www.owasp.org/index.php/Testing_for_NoSQL_injection)
* [Session management](https://www.owasp.org/index.php/Session_Management_Cheat_Sheet)
* [CSRF - Cross Site Request Forgery](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet)
  * [CSURF Express Module](https://www.npmjs.com/package/csurf)
* Signed Cookies: [cookie-parser Express Module](https://expressjs.com/en/resources/middleware/cookie-parser.html)

#### Resources

* [OWASP -Open Web Application Security Project](https://www.owasp.org/index.php/Main_Page)
* [Express: Production Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
* [RisingStack: Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)

#### Dedicated WAF

If you have the resources available (budget or hosting environment), a dedicated WAF (Web Application Firewall) can offer a robust solution to various security issues, such as blocking potential attackers and flagging their activity.

* [OWASP WAF information](https://www.owasp.org/index.php/Web_Application_Firewall)
* Hosting providers:
  * [AWS WAF](https://aws.amazon.com/waf/)
  * [Microsoft Azure WAF](https://docs.microsoft.com/en-us/azure/application-gateway/application-gateway-web-application-firewall-overview)
* [ModSecurity]() - Apache, nginX and other web servers.
* [CloudFlare](https://www.cloudflare.com/) - External WAF features.

