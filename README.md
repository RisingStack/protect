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

express.use(protect.express.sqlInjection())
express.use(protect.express.xss())
```
