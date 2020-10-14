
const conn = require('../../db/db')
const util = require('../../util/util')
const multer = require('multer')

const datatime = './public/images/avatar/'
// 将图片放到服务器
const storage = multer.diskStorage({
  // 如果你提供的 destination 是一个函数，你需要负责创建文件夹
  destination: datatime,
  // //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + '.jpg')
  }
})
const upload = multer({
  storage: storage
})

const USER = [
  // let upload = multer({dest:'./public/images/avatar'}).any();
  {
    type: 'post',
    data: upload.any(),
    pathName: 'admin/upLoadImg',
    cb: (req, res) => {
      res.json({ code: 1, data: req.files })
      util.log(req.files)
    }
  },

  // 更新用户信息
  {
    type: 'post',
    pathName: 'admin/updateUserInfo',
    cb: (req, res) => {
      const {
        userId,
        userName,
        avatar,
        password,
        sex,
        phone,
        sign,
        birthday
      } = req.body
      if (userId) {
        const sqlStr = 'SELECT * from t_user WHERE user_id = ? LIMIT 1;'
        conn.query(sqlStr, [userId], (error, result, field) => {
          if (error) {
            res.json({ code: -1, message: '用户不存在' })
          } else {
            let sqlStr = 'SELECT * FROM t_user WHERE user_name = ? AND user_id <> ? LIMIT 1;'
            conn.query(sqlStr, [userName, userId], (error, result, field) => {
              if (error) {
                util.log(error)
              } else {
                result = JSON.parse(JSON.stringify(result))
                if (result[0]) {
                  res.json({ code: -1, message: '用户名已存在！' })
                } else {
                  sqlStr = 'SELECT * FROM t_user WHERE phone = ? AND user_id <> ? LIMIT 1;'
                  conn.query(sqlStr, [phone, userId], (error, result, field) => {
                    if (error) {
                      util.log(error)
                    } else {
                      result = JSON.parse(JSON.stringify(result))
                      if (result[0]) {
                        res.json({ code: -1, message: '手机号码已注册！' })
                      } else {
                        // 更新数据库
                        const sqlStr = 'UPDATE t_user SET user_name = ?,avatar = ?,password = ?,sex = ? ,phone = ?,birthday = ?,sign = ? WHERE user_id = ?;'
                        conn.query(sqlStr, [userName, avatar, password, sex, phone, birthday, sign, userId], (error, result, field) => {
                          if (error) {
                            res.json({ code: -1, message: '更新用户信息失败' })
                            util.log(error)
                          } else {
                            res.json({ code: 1 })
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        })
      }
    }
  },

  // 删除用户信息
  {
    type: 'post',
    pathName: 'admin/deleteUserInfo',
    cb: (req, res) => {
      const { userId } = req.body
      if (userId) {
        let sqlStr = 'SELECT t_schedule.schedule_id, t_schedule.seat_info,order_seat_info FROM t_order INNER JOIN t_schedule ON t_order.schedule_id = t_schedule.schedule_id WHERE user_id = ?'
        conn.query(sqlStr, [userId], (error, result, field) => {
          if (error) {
            util.log(error)
          } else {
            result = JSON.parse(JSON.stringify(result))
            util.log(result)
            if (result) {
              result.forEach((value) => {
                let tempArr = []
                value.seat_info = JSON.parse(value.seat_info)
                value.order_seat_info = JSON.parse(value.order_seat_info)
                value.seat_info.forEach((v) => {
                  if (value.order_seat_info.indexOf(v) === -1) {
                    tempArr.push(v)
                  }
                })
                tempArr = JSON.stringify(tempArr)
                sqlStr = 'UPDATE t_schedule SET seat_info = ? WHERE schedule_id = ?;'
                conn.query(sqlStr, [tempArr, value.schedule_id], (error, result, field) => {
                  if (error) {
                    util.log(error)
                  }
                })
              })
            }
            sqlStr = 'DELETE FROM t_user WHERE user_id =?'
            conn.query(sqlStr, [userId], (error, result, field) => {
              if (error) {
                util.log(error)
              } else {
                res.json({ code: 1 })
              }
            })
          }
        })
      }
    }
  },

  // 添加用户信息
  {
    type: 'post',
    pathName: 'admin/addUserInfo',
    cb: (req, res) => {
      let {
        userName,
        avatar,
        phone,
        password,
        sex,
        sign,
        birthday
      } = req.body
      if (!avatar) {
        avatar = '/images/avatar/monkey.png'
      }
      let sqlStr = 'SELECT * FROM t_user WHERE user_name = ? LIMIT 1;'
      conn.query(sqlStr, [userName], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          if (result[0]) {
            res.json({ code: -1, message: '用户名已存在！' })
          } else {
            sqlStr = 'SELECT * FROM t_user WHERE phone = ? LIMIT 1'
            conn.query(sqlStr, [phone], (error, result, field) => {
              if (error) {
                util.log(error)
              } else {
                result = JSON.parse(JSON.stringify(result))
                if (result[0]) {
                  res.json({ code: -1, message: '手机号码已注册！' })
                } else {
                  sqlStr = 'INSERT INTO t_user(user_name,avatar,phone,password,sex,sign,birthday) VALUES(?,?,?,?,?,?,?);'
                  conn.query(sqlStr, [userName, avatar, phone, password, sex, sign, birthday], (error, result, field) => {
                    if (error) {
                      util.log(error)
                    } else {
                      res.json({ code: 1 })
                    }
                  })
                }
              }
            })
          }
        }
      })
    }
  },

  // 获取当前页电影
  {
    pathName: 'admin/getCurrentPageMovie',
    cb: (req, res) => {
      let {
        currentPage, pageSize, input
      } = req.query
      const start = Number((currentPage - 1) * pageSize)
      pageSize = Number(pageSize)
      let sqlStr = 'SELECT * FROM t_movie WHERE name LIKE ? ORDER BY movie_id'
      let total
      conn.query(sqlStr, ['%' + input + '%'], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          total = result.length
        }
      })
      sqlStr = 'SELECT * FROM t_movie WHERE name LIKE ? ORDER BY movie_id LIMIT ?,?;'
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

  // 更新电影信息
  {
    type: 'post',
    pathName: 'admin/updateMovieInfo',
    cb: (req, res) => {
      const {
        movieId,
        movieName,
        poster,
        director,
        actor,
        long,
        type,
        language,
        publicDate,
        intro
      } = req.body
      const sqlStr = 'SELECT * FROM t_movie WHERE name = ? AND movie_id <> ? LIMIT 1;'
      conn.query(sqlStr, [movieName, movieId], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          if (result[0]) {
            res.json({ code: -1, message: '电影名已存在！' })
          } else {
            // 更新数据库
            const sqlStr = 'UPDATE t_movie SET name = ?,poster = ?,director = ?,actor = ? ,movie_long = ?,type = ?,language = ?,public_date = ?,intro = ? WHERE movie_id = ?;'
            conn.query(sqlStr, [movieName, poster, director, actor, long, type, language, publicDate, intro, movieId], (error, result, field) => {
              if (error) {
                util.log(error)
              } else {
                res.json({ code: 1 })
              }
            })
          }
        }
      })
    }
  },

  // 添加电影信息
  {
    type: 'post',
    pathName: 'admin/addMovieInfo',
    cb: (req, res) => {
      const {
        movieName,
        poster,
        director,
        actor,
        long,
        type,
        language,
        publicDate,
        intro
      } = req.body
      const sqlStr = 'SELECT * FROM t_movie WHERE name = ? LIMIT 1;'
      conn.query(sqlStr, [movieName], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          if (result[0]) {
            res.json({ code: -1, message: '电影名已存在！' })
          } else {
            const sqlStr = 'INSERT INTO t_movie(name,poster,director,actor,movie_long,type,language,public_date,intro) VALUES(?,?,?,?,?,?,?,?,?);'
            conn.query(sqlStr, [movieName, poster, director, actor, long, type, language, publicDate, intro], (error, result, field) => {
              if (error) {
                util.log(error)
              } else {
                res.json({ code: 1 })
              }
            })
          }
        }
      })
    }
  }

]

module.exports = USER
