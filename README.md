## Protect by RisingStack

The purpose of this module is to provide out-of-box, proactive protection for common security problems, like
SQL injection attacks or XSS attacks.

![protect by risingstack](https://blog-assets.risingstack.com/2017/05/lock.png)

Once the module recognizes an attack pattern, it won't let the request go through.

### Usage

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

#### Just the ruleset

```javascript
const protect = require('@risingstack/protect')
const express = require('express')

const app = express()

app.get('/', (req, res) => {
  if (protect.rules.isSqlInjection(req.originalUrl)) {
    // do something with the problematic request
  }

  // continue with the routehandler
})
```
