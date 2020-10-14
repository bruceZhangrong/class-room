const conn = require('../../db/db')
const util = require('../../util/util')

const ORDER = [
  // 获取当前页订单
  {
    type: 'post',
    pathName: 'admin/getCurrentPageOrder',
    cb: (req, res) => {
      let {
        currentPage, pageSize, input
      } = req.query
      const start = Number((currentPage - 1) * pageSize)
      pageSize = Number(pageSize)
      let sqlStr = 'SELECT * FROM t_order INNER JOIN t_schedule ON t_order.schedule_id = t_schedule.schedule_id INNER JOIN t_movie ON t_movie.movie_id = t_schedule.movie_id INNER JOIN t_cinema ON t_cinema.cinema_id = t_schedule.cinema_id INNER JOIN t_user ON t_order.user_id = t_user.user_id WHERE t_movie.name LIKE ? ORDER BY order_id;'
      let total
      conn.query(sqlStr, ['%' + input + '%'], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          total = result.length
        }
      })
      sqlStr = 'SELECT * FROM t_order INNER JOIN t_schedule ON t_order.schedule_id = t_schedule.schedule_id INNER JOIN t_movie ON t_movie.movie_id = t_schedule.movie_id INNER JOIN t_cinema ON t_cinema.cinema_id = t_schedule.cinema_id INNER JOIN t_user ON t_order.user_id = t_user.user_id WHERE t_movie.name LIKE ? ORDER BY order_id LIMIT ?,?;'
      conn.query(sqlStr, ['%' + input + '%', start, pageSize], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          res.json({ code: 1, data: result, total: total })
        }
      })
    }
  },

  // 删除订单
  {
    type: 'post',
    pathName: 'admin/deleteOrder',
    cb: (req, res) => {
      let {
        orderId,
        scheduleId,
        orderSeatInfo
      } = req.body
      if (orderId) {
        let sqlStr = 'SELECT seat_info FROM t_schedule WHERE schedule_id = ?'
        conn.query(sqlStr, [scheduleId], (error, result, field) => {
          if (error) {
            util.log(error)
          } else {
            result = result[0].seat_info
            result = JSON.parse(result)
            orderSeatInfo = JSON.parse(orderSeatInfo)
            util.log(typeof result)
            util.log(typeof orderSeatInfo)
            const tempArr = []
            result.forEach((value) => {
              if (orderSeatInfo.indexOf(value) === -1) {
                tempArr.push(value)
              }
            })
            util.log(tempArr)
            result = JSON.stringify(tempArr)
            sqlStr = 'UPDATE t_schedule SET seat_info = ? WHERE schedule_id = ?;'
            conn.query(sqlStr, [result, scheduleId], (error, result, field) => {
              if (error) {
                util.log(error)
              } else {
                sqlStr = 'DELETE FROM t_order WHERE order_id =?'
                conn.query(sqlStr, [orderId], (error, result, field) => {
                  if (error) {
                    util.log(error)
                  } else {
                    res.json({ code: 1 })
                  }
                })
              }
            })
          }
        })
      }
    }
  }
]

module.exports = ORDER
