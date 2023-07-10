# Session lib by [boutdecode](https://boutdecode.fr)

![https://boutdecode.fr/img/logo.png](https://boutdecode.fr/img/logo.png)

## Installation

```shell
$ npm install @boutdecode/session
```

## Yion plugin

For yion : 

```javascript
const { createApp, createServer } = require('@boutdecode/yion')
const sessionPlugin = require('@boutdecode/session/yion/session-plugin')

const app = createApp()
const server = createServer(app, [sessionPlugin])

app.get('/', (req, res) => {
    req.session // Current session
})

app.post('/login', (req, res) => {
    // ... do sign in
    
    req.session.user = user
    req.session.keep(24 * 60 * 60) // Keep session open for 24h
})

app.get('/admin', (req, res) => {
    if (req.session.user) {
        // Connected !
    }
    
    res.redirect('/login')
})

server.listen(8080)
```

## Tests

```shell
$ npm run test
```
