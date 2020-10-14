const LOGIN = require('./login')
const USER = require('./user')
const FILM = require('./film')
const ORDER = require('./order')

const BACK_API = [
  ...LOGIN,
  ...USER,
  ...FILM,
  ...ORDER
]

module.exports = BACK_API
