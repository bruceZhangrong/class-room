'use strict'

let dbm = null
let type = null
let seed = null

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}

exports.up = function (db) {
  return db.createTable('users', {
    id: { type: 'int', primaryKey: true, notNull: true, autoIncrement: true },
    name: 'string',
    age: 'int',
    phone: { type: 'string', length: 11 },
    class: { type: 'string', notNull: true }
  })
}

exports.down = function (db) {
  return db.dropTable('users')
}

exports._meta = {
  version: 1
}
