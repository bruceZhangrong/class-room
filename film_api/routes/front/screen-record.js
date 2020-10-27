const conn = require('../../db/db')
const util = require('../../util/util')

const SCREEN_RECORD = [
  {
    pathName: 'screen-record',
    cb (req, res) {
      const [userId] = [util.getCookie(req.headers.cookie, 'user_id')]
      if (!userId) {
        res.json(util.getErrorJson('登录过期'))
        return
      }
      const sqlStr = 'select * from screen_record where user_id = ?;'
      conn.query(sqlStr, [userId], (err, result, field) => {
        if (err) {
          util.log(err)
          res.json(util.getErrorJson('获取数据失败'))
        } else {
          result = JSON.parse(JSON.stringify(result))
          const jsonObj = result[0] ? {
            code: 1,
            data: result.sort((a, b) => b.id - a.id).map(v => ({
              id: v.id,
              info: v.info,
              createTime: v.create_time
            }))
          } : util.getErrorJson('暂无数据')
          res.json(jsonObj)
        }
      })
    }
  },
  {
    type: 'post',
    pathName: 'screen-record',
    cb (req, res) {
      const [userId] = [util.getCookie(req.headers.cookie, 'user_id')]
      if (!userId) {
        res.json(util.getErrorJson('登录过期'))
        return
      }
      const sqlStr = 'insert into screen_record(user_id, create_time, info) values (?, ?, ?)'
      conn.query(sqlStr, [userId, req.body.createTime, req.body.content], (err, result, field) => {
        if (err) {
          util.log(err)
          res.json(util.getErrorJson(`${req.body.createTime}: '保存数据失败'`))
        } else {
          res.json({ code: 1, data: true })
        }
      })
    }
  },
  {
    type: 'delete',
    pathName: 'screen-record',
    cb (req, res) {
      const [userId] = [util.getCookie(req.headers.cookie, 'user_id')]
      if (!userId) {
        res.json(util.getErrorJson('登录过期'))
        return
      }
      const sqlStr = 'delete from screen_record where user_id = ? and id = ? limit 1'
      conn.query(sqlStr, [userId, req.query.id], (err, result, field) => {
        if (err) {
          util.log(err)
          res.json(util.getErrorJson('删除数据失败'))
        } else {
          res.json({ code: 1, data: true })
        }
      })
    }
  }
]

module.exports = SCREEN_RECORD
