const conn = require('../../db/db')
const util = require('../../util/util')

const ORDER = [
  // 用户下单
  {
    type: 'post',
    pathName: 'order',
    cb: (req, res) => {
      const {
        userId,
        scheduleId,
        orderPhone,
        orderDate,
        ticketNum,
        totalPrice,
        orderSeatInfo,
        payType
      } = req.body
      const phoneCode = util.randomCode(6)
      const sqlStr = 'INSERT INTO t_order(user_id,schedule_id,order_phone,order_date,ticket_num,ticket_total_price,order_seat_info,pay_type,phone_code) VALUES(?,?,?,?,?,?,?,?,?); '
      conn.query(sqlStr, [userId, scheduleId, orderPhone, orderDate, ticketNum, totalPrice, orderSeatInfo, payType, phoneCode], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          res.json({ code: 1, data: { phone_code: phoneCode } })
        }
      })
    }
  },

  // 获取个人订单信息
  {
    pathName: 'getOrderByUserId',
    cb: (req, res) => {
      const userId = req.query.userId
      const sqlStr = 'SELECT * FROM t_order INNER JOIN t_schedule ON t_order.schedule_id = t_schedule.schedule_id INNER JOIN t_movie ON t_movie.movie_id = t_schedule.movie_id INNER JOIN t_cinema ON t_cinema.cinema_id = t_schedule.cinema_id WHERE user_id = ?;'
      conn.query(sqlStr, [userId], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          res.json({ code: 1, data: result })
        }
      })
    }
  },

  // 获取个人订单信息
  {
    pathName: 'getWishMovieByUserId',
    cb: (req, res) => {
      const userId = req.query.userId
      const sqlStr = 'SELECT * FROM t_wishmovie INNER JOIN t_movie ON t_wishmovie.movie_id = t_movie.movie_id WHERE user_id = ?;'
      conn.query(sqlStr, [userId], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          res.json({ code: 1, data: result })
        }
      })
    }
  },

  // 获取个人订单信息
  {
    pathName: 'getIsWatchedMovieByUserId',
    cb: (req, res) => {
      const userId = req.query.userId
      const sqlStr = 'SELECT * FROM t_comment INNER JOIN t_movie ON t_comment.movie_id = t_movie.movie_id WHERE user_id = ? AND is_pass = 1;'
      conn.query(sqlStr, [userId], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          res.json({ code: 1, data: result })
        }
      })
    }
  }
]

module.exports = ORDER
