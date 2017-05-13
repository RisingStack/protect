## Protect by RisingStack

The purpose of this module is to provide out-of-box, proactive protection for common security problems, like
SQL injection attacks or XSS attacks.

![protect by risingstack](https://blog-assets.risingstack.com/2017/05/lock.png)

Once the module recognizes an attack pattern, it won't let the request go through.

### Basic usage

```bash
npm i @risingstack/protect --save
```

#### With Express

```javascript
const protect = require('@risingstack/protect')
const express = require('express')

const app = express()

app.use(protect.express.sqlInjection())
app.use(protect.express.xss())
```

### API

#### `protect.express.sqlInjection([options])`

Returns an Express middleware, which checks for SQL injections.

* `options.body`: if this options is set, the middleware will check for request bodies - options passed here are passed to the `raw-body` module
* `options.loggerFunction`: you can provide a logger function for the middleware to log attacks

#### `protect.express.xss([options])`

Returns an Express middleware, which checks for XSS attacks.

* `options.body`: if this options is set, the middleware will check for request bodies - options passed here are passed to the `raw-body` module
* `options.loggerFunction`: you can provide a logger function for the middleware to log attacks
