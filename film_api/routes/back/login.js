
const conn = require('../../db/db')
const util = require('../../util/util')

const LOGIN = [
  // 获取手机验证码
  {
    type: 'post',
    pathName: 'admin/login',
    cb: (req, res) => {
      const name = req.body.userName
      const password = req.body.password
      const sqlStr = 'SELECT * FROM t_admin WHERE name = ? LIMIT 1 ;'
      conn.query(sqlStr, [name, password], (error, result, field) => {
        if (error) {
          res.json({ code: -1, message: '查询用户失败' })
        } else {
          result = JSON.parse(JSON.stringify(result))
          if (result[0]) {
            if (result[0].password === password) {
              // 保存用户id
              req.session.adminId = result[0].admin_id
              res.cookie('admin_id', result[0].admin_id)
              res.json({ code: 1 })
            } else {
              res.json({ code: -1, message: '密码错误' })
            }
          } else {
            res.json({ code: -1, message: '用户不存在' })
          }
        }
      })
    }
  },

  // 获取图形验证码
  {
    pathName: 'admin/getAdminInfo',
    cb: (req, res) => {
      const adminId = req.query.adminId
      const sqlStr = 'SELECT * FROM t_admin WHERE admin_id = ? LIMIT 1 ;'
      conn.query(sqlStr, [adminId], (error, result, field) => {
        if (error) {
          res.json({ code: -1, message: '查询用户失败' })
        } else {
          result = JSON.parse(JSON.stringify(result))
          if (result[0]) {
            res.json({ code: 1, data: result[0] })
          } else {
            res.json({ code: -1, message: '用户不存在' })
          }
        }
      })
    }
  },

  // 电话登录
  {
    pathName: 'admin/getCurrentPageUser',
    cb: (req, res) => {
      let {
        currentPage, pageSize, input
      } = req.query
      const start = Number((currentPage - 1) * pageSize)
      pageSize = Number(pageSize)
      let sqlStr = 'SELECT * FROM t_user WHERE user_name LIKE ? ORDER BY user_id;'
      let total
      conn.query(sqlStr, ['%' + input + '%'], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          total = result.length
        }
      })
      sqlStr = 'SELECT * FROM t_user WHERE user_name LIKE ? ORDER BY user_id LIMIT ?,?;'
      conn.query(sqlStr, ['%' + input + '%', start, pageSize], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          res.json({ code: 1, data: result, total: total })
        }
      })
    }
  }
]

module.exports = LOGIN
