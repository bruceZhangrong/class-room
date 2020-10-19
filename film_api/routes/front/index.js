const COMMON = require('./common')
const LOGIN = require('./login')
const USER = require('./user')
const FILM = require('./film')
const ORDER = require('./order')
const SCREEN_RECORD = require('./screen-record')

const FRONT_API = [
  ...COMMON,
  ...LOGIN,
  ...USER,
  ...FILM,
  ...ORDER,
  ...SCREEN_RECORD
]

module.exports = FRONT_API
