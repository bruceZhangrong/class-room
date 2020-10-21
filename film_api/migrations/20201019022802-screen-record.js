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
  return db.createTable('screen_record', {
    id: {
      type: 'int',
      primaryKey: true,
      notNull: true,
      autoIncrement: true
    },
    info: { type: 'mediumtext' },
    user_id: { type: 'int', notNull: true },
    create_time: { type: 'string', notNull: true }
  })
}

exports.down = function (db) {
  return db.dropTable('screen_record')
}

exports._meta = {
  version: 1
}
