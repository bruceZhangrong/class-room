const COMMON = require('./common')
const LOGIN = require('./login')
const USER = require('./user')
const FILM = require('./film')
const ORDER = require('./order')

const FRONT_API = [
  ...COMMON,
  ...LOGIN,
  ...USER,
  ...FILM,
  ...ORDER
]

module.exports = FRONT_API
