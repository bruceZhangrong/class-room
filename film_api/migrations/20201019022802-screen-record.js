'use strict'

var dbm
var type
var seed

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
  return db.createTable('screen_recode', {
    id: {
      type: 'int',
      primaryKey: true,
      notNull: true,
      autoincrement: true
    },
    info: { type: 'string' },
    user_id: { type: 'int', notNull: true },
    createTime: { type: 'string', notNull: true }
  })
}

exports.down = function (db) {
  return db.dropTable('screen_recode')
}

exports._meta = {
  version: 1
}
