
const conn = require('../../db/db')
const util = require('../../util/util')

const USER = [
  // 更新用户头像
  {
    type: 'put',
    pathName: 'updateUserAvatar',
    cb: (req, res) => {
      const { userId, avatar } = req.body
      if (userId) {
        const sqlStr = 'SELECT * from t_user WHERE user_id = ? LIMIT 1;'
        conn.query(sqlStr, [userId], (error, result, field) => {
          if (error) {
            res.json(util.getErrorJson('用户不存在'))
          } else {
            const sqlStr = 'UPDATE t_user SET avatar = ? WHERE user_id = ?;'
            conn.query(sqlStr, [avatar, userId], (error, result, field) => {
              const jsonStr = error ? util.getErrorJson('更新用户头像失败') : { code: 1 }
              res.json(jsonStr)
            })
          }
        })
      }
    }
  },

  // 更新用户名
  {
    pathName: 'updateUserName',
    cb: (req, res) => {
      const { userId, userName } = req.body
      if (userId) {
        const sqlSearchById = 'SELECT * from t_user WHERE user_id = ? LIMIT 1;'
        conn.query(sqlSearchById, [userId], (error, result, field) => {
          if (error) {
            res.json({ code: -1, message: '用户不存在' })
          } else {
            const sqlSearchByName = 'SELECT * FROM t_user WHERE user_name = ? AND user_id <> ? LIMIT 1 ;'
            conn.query(sqlSearchByName, [userName, userId], (error, result, field) => {
              if (error) {
                util.log(error)
              } else {
                result = JSON.parse(JSON.stringify(result))
                if (result[0]) {
                  res.json(util.getErrorJson('用户名已存在！'))
                } else {
                  // 更新数据库
                  const sqlUpdate = 'UPDATE t_user SET user_name = ? WHERE user_id = ?;'
                  conn.query(sqlUpdate, [userName, userId], (error, result, field) => {
                    const jsonObj = error ? util.getErrorJson('更新用户名失败') : { code: 1 }
                    res.json(jsonObj)
                  })
                }
              }
            })
          }
        })
      }
    }
  },

  // 更新用户性别
  {
    pathName: 'updateUserSex',
    cb: (req, res) => {
      const { userId, sex } = req.body
      if (userId) {
        const sqlStr = 'SELECT * from t_user WHERE user_id = ? LIMIT 1;'
        conn.query(sqlStr, [userId], (error, result, field) => {
          if (error) {
            res.json(util.getErrorJson('用户不存在'))
          } else {
            // 更新数据库
            const sqlStr = 'UPDATE t_user SET sex = ? WHERE user_id = ?;'
            conn.query(sqlStr, [sex, userId], (error, result, field) => {
              const jsonObj = error ? util.getErrorJson('更新用户性别失败') : { code: 1 }
              res.json(jsonObj)
            })
          }
        })
      }
    }
  },

  // 更新用户生日
  {
    pathName: 'updateUserBirthday',
    cb: (req, res) => {
      const { userId, birthday } = req.body
      if (userId) {
        const sqlStr = 'SELECT * from t_user WHERE user_id = ? LIMIT 1;'
        conn.query(sqlStr, [userId], (error, result, field) => {
          if (error) {
            res.json({ code: -1, message: '用户不存在' })
          } else {
            // 更新数据库
            const sqlStr = 'UPDATE t_user SET birthday = ? WHERE user_id = ?;'
            conn.query(sqlStr, [birthday, userId], (error, result, field) => {
              if (error) {
                res.json({ code: -1, message: '更新用户生日失败' })
              } else {
                res.json({ code: 1 })
              }
            })
          }
        })
      }
    }
  },

  // 更新用户签名
  {
    pathName: 'updateUserSign',
    cb: (req, res) => {
      const { userId, sign } = req.body
      if (userId) {
        const sqlStr = 'SELECT * from t_user WHERE user_id = ? LIMIT 1;'
        conn.query(sqlStr, [userId], (error, result, field) => {
          if (error) {
            res.json({ code: -1, message: '用户不存在' })
          } else {
            // 更新数据库
            const sqlStr = 'UPDATE t_user SET sign = ? WHERE user_id = ?;'
            conn.query(sqlStr, [sign, userId], (error, result, field) => {
              if (error) {
                res.json({ code: -1, message: '更新用户签名失败' })
              } else {
                res.json({ code: 1 })
              }
            })
          }
        })
      }
    }
  },

  // 更新用户信息
  {
    pathName: 'updateUserInfo',
    cb: (req, res) => {
      const { userId, userName, avatar, password, sex, sign, birthday } = req.body
      if (userId) {
        let sqlStr = 'SELECT * from t_user WHERE user_id = ? LIMIT 1;'
        conn.query(sqlStr, [userId], (error, result, field) => {
          if (error) {
            res.json({ code: -1, message: '用户不存在' })
          } else {
            sqlStr = 'SELECT * FROM t_user WHERE user_name = ? AND user_id <> ? LIMIT 1 ;'
            conn.query(sqlStr, [userName, userId], (error, result, field) => {
              if (error) {
                util.log(error)
              } else {
                result = JSON.parse(JSON.stringify(result))
                if (result[0]) {
                  res.json({ code: -1, message: '用户名已存在！' })
                } else {
                  // 更新数据库
                  const sqlStr = 'UPDATE t_user SET user_name = ?,avatar = ?,password = ?,sex = ? ,birthday = ?,sign = ?WHERE user_id = ?;'
                  conn.query(sqlStr, [userName, avatar, password, sex, birthday, sign, userId], (error, result, field) => {
                    if (error) {
                      res.json({ code: -1, message: '更新用户信息失败' })
                    } else {
                      res.json({ code: 1 })
                    }
                  })
                }
              }
            })
          }
        })
      }
    }
  }

]

module.exports = USER
