const express = require('express')
const router = express.Router()

const FRONT_API = require('./front')
const BACK_API = require('./back')

;[...FRONT_API, ...BACK_API].forEach(v => {
  const { type = 'get', pathName = '/', cb, data } = v
  const url = `/api/${pathName}`
  data ? router[type](url, data, cb) : router[type](url, cb)
})

module.exports = router
