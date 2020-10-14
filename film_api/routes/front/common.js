
const conn = require('../../db/db')

const COMMON = [
  /* GET home page. */
  {
    pathName: '/',
    cb: (req, res, next) => {
      res.render('index', { title: 'Express' })
    }
  },
  // 获取用户信息
  {
    pathName: 'getUserInfo',
    cb: (req, res) => {
      const userId = req.query.userId
      if (userId) {
        const sqlStr = 'SELECT * from t_user WHERE user_id = ? LIMIT 1;'
        conn.query(sqlStr, [userId], (error, result, field) => {
          if (error) {
            res.json({ code: -1, message: '获取用户信息失败' })
          } else {
            result = JSON.parse(JSON.stringify(result))
            const backRes = result[0] ? {
              code: 1,
              data: result[0]
            } : {
              code: -1,
              message: '用户信息不存在'
            }
            res.json(backRes)
          }
        })
      }
    }
  }

]

module.exports = COMMON
