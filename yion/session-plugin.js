const { randomUUID } = require('node:crypto')
const sessions = {}

const startSession = (req, res) => {
  req.sessionId = randomUUID()

  sessions[req.sessionId] = {
    id: req.sessionId,
    flashMessages: {},

    flash (message, level = 'info') {
      if (!this.flashMessages[level]) {
        this.flashMessages[level] = []
      }

      this.flashMessages[level].push(message)
    },

    getFlashMessages (level) {
      const messages = this.flashMessages[level] || []

      this.clearFlash()

      return messages
    },

    clearFlash () {
      this.flashMessages = {}
    },

    destroy () {
      delete sessions[req.sessionId]

      res.set('Set-Cookie', `session=${req.sessionId}; Max-Age=-1`)
    },

    keep (time = (24 * 60 * 60)) {
      res.set('Set-Cookie', `session=${req.sessionId}; Max-Age=${time}; Path=/; SameSite=Strict; Secure; HttpOnly`)
    }
  }

  res.set('Set-Cookie', `session=${req.sessionId}; Path=/; SameSite=Strict; Secure; HttpOnly`)

  req.session = sessions[req.sessionId]
}

const parseSessionCookie = (cookies) => {
  const matches = cookies.match(/session=([a-z0-9-]+)/)

  return matches ? matches[1] : null
}

module.exports = {
  type: 'session',
  handle: (req, res, app, next) => {
    const cookie = parseSessionCookie(req.headers.cookie || '')
    if (cookie) {
      req.session = sessions[cookie]
    } else {
      startSession(req, res, {})
    }

    next()
  }
}
