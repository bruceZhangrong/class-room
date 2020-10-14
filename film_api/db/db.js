const mysql = require('mysql')

const conn = mysql.createConnection({
  host: 'localhost', // 数据库地址
  user: 'test_root', // 用户名
  password: '', // 密码
  database: 'test' // 数据库名
})
conn.connect()
module.exports = conn
