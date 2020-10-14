
const conn = require('../../db/db')
const util = require('../../util/util')
const multer = require('multer')

const datatime = './public/images/movie/'
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
const FILM = [
  // 加载电影列表
  {
    type: 'post',
    data: upload.any(),
    pathName: 'admin/upLoadMovieImg',
    cb: (req, res) => {
      res.json({ code: 1, data: req.files })
      util.log(req.files)
    }
  },

  // 删除电影信息
  {
    type: 'post',
    pathName: 'admin/deleteMovieInfo',
    cb: (req, res) => {
      const {
        movieId
      } = req.body
      const sqlStr = 'DELETE FROM t_movie WHERE movie_id =?'
      conn.query(sqlStr, [movieId], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          res.json({ code: 1 })
        }
      })
    }
  },

  // 获取当前页影院
  {
    pathName: 'admin/getCurrentPageCinema',
    cb: (req, res) => {
      let {
        currentPage, pageSize, input
      } = req.query
      const start = Number((currentPage - 1) * pageSize)
      pageSize = Number(pageSize)
      let sqlStr = 'SELECT * FROM t_cinema WHERE cinema_name LIKE ? ORDER BY cinema_id ;'
      let total
      conn.query(sqlStr, ['%' + input + '%'], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          total = result.length
        }
      })
      sqlStr = 'SELECT * FROM t_cinema WHERE cinema_name LIKE ? ORDER BY cinema_id LIMIT ?,?;'
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

  // 更新影院信息
  {
    type: 'post',
    pathName: 'admin/updateCinemaInfo',
    cb: (req, res) => {
      const {
        cinemaId,
        cinemaName,
        cinemaPhone,
        address
      } = req.body
      if (cinemaId) {
        let sqlStr = 'SELECT * from t_cinema WHERE cinema_id = ? LIMIT 1;'
        conn.query(sqlStr, [cinemaId], (error, result, field) => {
          if (error) {
            util.log(error)
          } else {
            sqlStr = 'SELECT * FROM t_cinema WHERE cinema_name = ? AND cinema_id <> ? LIMIT 1 ;'
            conn.query(sqlStr, [cinemaName, cinemaId], (error, result, field) => {
              if (error) {
                util.log(error)
              } else {
                result = JSON.parse(JSON.stringify(result))
                if (result[0]) {
                  res.json({ code: -1, message: '影院名已存在！' })
                } else {
                  // 更新数据库
                  const sqlStr = 'UPDATE t_cinema SET cinema_name = ?,cinema_phone = ?,specified_address = ? WHERE cinema_id = ?;'
                  conn.query(sqlStr, [cinemaName, cinemaPhone, address, cinemaId], (error, result, field) => {
                    if (error) {
                      res.json({ code: -1, message: '更新影院信息失败' })
                      util.log(error)
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
  },

  // 删除影院信息
  {
    type: 'post',
    pathName: 'admin/deleteCinemaInfo',
    cb: (req, res) => {
      const {
        cinemaId
      } = req.body
      if (cinemaId) {
        const sqlStr = 'DELETE FROM t_cinema WHERE cinema_id =?'
        conn.query(sqlStr, [cinemaId], (error, result, field) => {
          if (error) {
            util.log(error)
          } else {
            res.json({ code: 1 })
          }
        })
      }
    }
  },

  // 添加影院信息
  {
    type: 'post',
    pathName: 'admin/addCinemaInfo',
    cb: (req, res) => {
      const {
        cinemaName,
        cinemaPhone,
        address
      } = req.body
      const sqlStr = 'SELECT * FROM t_cinema WHERE cinema_name = ? LIMIT 1 ;'
      conn.query(sqlStr, [cinemaName], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          if (result[0]) {
            res.json({ code: -1, message: '影院名已存在！' })
          } else {
            const sqlStr = 'INSERT INTO t_cinema(cinema_name,cinema_phone,specified_address) VALUES(?,?,?);'
            conn.query(sqlStr, [cinemaName, cinemaPhone, address], (error, result, field) => {
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

  // 获取当前页评论
  {
    pathName: 'admin/getCurrentPageComment',
    cb: (req, res) => {
      let {
        currentPage, pageSize, input
      } = req.query
      const start = Number((currentPage - 1) * pageSize)
      pageSize = Number(pageSize)
      let sqlStr = 'SELECT * FROM t_comment INNER JOIN t_movie ON t_comment.movie_id = t_movie.movie_id INNER JOIN t_user ON t_user.user_id=t_comment.user_id WHERE t_movie.name LIKE ? ORDER BY comment_id;'
      let total
      conn.query(sqlStr, ['%' + input + '%'], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          total = result.length
        }
      })
      sqlStr = 'SELECT * FROM t_comment INNER JOIN t_movie ON t_comment.movie_id = t_movie.movie_id INNER JOIN t_user ON t_user.user_id=t_comment.user_id WHERE t_movie.name LIKE ? ORDER BY comment_id LIMIT ?,?;'
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

  // 通过当前评论
  {
    type: 'post',
    pathName: 'admin/passCurrentComment',
    cb: (req, res) => {
      const commentId = req.body.commentId
      const movieId = req.body.movieId
      if (commentId) {
        let sqlStr = 'UPDATE t_comment SET is_pass = 1 WHERE comment_id = ?;'
        conn.query(sqlStr, [commentId], (error, result, field) => {
          if (error) {
            util.log(error)
          } else {
            sqlStr = 'SELECT user_score FROM t_comment WHERE movie_id = ? AND is_pass = ?;'
            conn.query(sqlStr, [movieId, 1], (error, result, field) => {
              if (error) {
                util.log(error)
              } else {
                result = JSON.parse(JSON.stringify(result))
                let avgScore = 0
                if (result.length) {
                  result.forEach((val) => {
                    avgScore += (Number(val.user_score))
                  })
                  avgScore = (avgScore / Number(result.length)).toFixed(1)
                }
                sqlStr = 'UPDATE t_movie SET score = ? WHERE movie_id = ?;'
                conn.query(sqlStr, [avgScore, movieId], (error, result, field) => {
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
  },

  // 删除当前评论
  {
    type: 'post',
    pathName: 'admin/deleteCurrentComment',
    cb: (req, res) => {
      const commentId = req.body.commentId
      const movieId = req.body.movieId
      if (commentId) {
        let sqlStr = 'DELETE FROM t_comment WHERE comment_id = ?;'
        conn.query(sqlStr, [commentId], (error, result, field) => {
          if (error) {
            util.log(error)
          } else {
            sqlStr = 'SELECT user_score FROM t_comment WHERE movie_id = ? AND is_pass = ?;'
            conn.query(sqlStr, [movieId, 1], (error, result, field) => {
              if (error) {
                util.log(error)
              } else {
                result = JSON.parse(JSON.stringify(result))
                let avgScore = 0
                if (result.length) {
                  result.forEach((val) => {
                    avgScore += (Number(val.user_score))
                  })
                  avgScore = (avgScore / Number(result.length)).toFixed(1)
                }
                sqlStr = 'UPDATE t_movie SET score = ? WHERE movie_id = ?;'
                conn.query(sqlStr, [avgScore, movieId], (error, result, field) => {
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
  },

  // 加载影院列表
  {
    pathName: 'admin/getCurrentPageHall',
    cb: (req, res) => {
      let {
        currentPage, pageSize, input
      } = req.query
      const start = Number((currentPage - 1) * pageSize)
      pageSize = Number(pageSize)
      let sqlStr = 'SELECT * FROM t_hall INNER JOIN t_cinema ON t_cinema.cinema_id = t_hall.cinema_id WHERE t_cinema.cinema_name LIKE ? ORDER BY hall_id;'
      let total
      conn.query(sqlStr, ['%' + input + '%'], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          total = result.length
        }
      })
      sqlStr = 'SELECT * FROM t_hall INNER JOIN t_cinema ON t_cinema.cinema_id = t_hall.cinema_id WHERE t_cinema.cinema_name LIKE ? ORDER BY hall_id LIMIT ?,?;'
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

  // 删除影厅
  {
    type: 'post',
    pathName: 'admin/deleteHall',
    cb: (req, res) => {
      const {
        cinemaId,
        hallName
      } = req.body
      if (cinemaId) {
        let sqlStr = 'SELECT schedule_id FROM t_schedule WHERE cinema_id = ? AND hall_name = ?;'
        conn.query(sqlStr, [cinemaId, hallName], (error, result, field) => {
          if (error) {
            util.log(error)
          } else {
            result = JSON.parse(JSON.stringify(result))
            util.log(result)
            if (result.length) {
              result.forEach((value) => {
                sqlStr = 'DELETE FROM t_schedule WHERE schedule_id = ?;'
                conn.query(sqlStr, [value.schedule_id], (error, result, field) => {
                  if (error) {
                    util.log(error)
                  }
                })
              })
            }
            sqlStr = 'DELETE FROM t_hall WHERE cinema_id = ? AND name = ?'
            conn.query(sqlStr, [cinemaId, hallName], (error, result, field) => {
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

  // 更新影厅信息
  {
    type: 'post',
    pathName: 'admin/updateHallInfo',
    cb: (req, res) => {
      const {
        hallId,
        cinemaId,
        hallOldName,
        hallNewName
      } = req.body
      if (cinemaId) {
        let sqlStr = 'SELECT * FROM t_hall WHERE name = ? AND cinema_id = ? AND hall_id <> ? LIMIT 1;'
        conn.query(sqlStr, [hallNewName, cinemaId, hallId], (error, result, field) => {
          if (error) {
            util.log(error)
          } else {
            result = JSON.parse(JSON.stringify(result))
            if (result[0]) {
              res.json({ code: -1, message: '该影院的影厅已存在！' })
            } else {
              sqlStr = 'UPDATE t_schedule SET hall_name = ? WHERE cinema_id = ? AND hall_name = ?'
              conn.query(sqlStr, [hallNewName, cinemaId, hallOldName], (error, result, field) => {
                if (error) {
                  util.log(error)
                } else {
                  // 更新数据库
                  const sqlStr = 'UPDATE t_hall SET name = ? WHERE cinema_id = ? AND name = ?;'
                  conn.query(sqlStr, [hallNewName, cinemaId, hallOldName], (error, result, field) => {
                    if (error) {
                      res.json({ code: -1, message: '更新影影厅信息失败' })
                      util.log(error)
                    } else {
                      res.json({ code: 1 })
                    }
                  })
                }
              })
            }
          }
        })
      }
    }
  },

  // 获取所有影院
  {
    pathName: 'admin/getAllCinema',
    cb: (req, res) => {
      const sqlStr = 'SELECT cinema_id,cinema_name FROM t_cinema;'
      conn.query(sqlStr, (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          res.json({ code: 1, data: result })
        }
      })
    }
  },

  // 添加影厅信息
  {
    type: 'post',
    pathName: 'admin/addHallInfo',
    cb: (req, res) => {
      const {
        cinemaId,
        hallName
      } = req.body
      const sqlStr = 'SELECT * FROM t_hall WHERE name = ? AND cinema_id = ? LIMIT 1;'
      conn.query(sqlStr, [hallName, cinemaId], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          if (result[0]) {
            res.json({ code: -1, message: '该影院的影厅已存在！' })
          } else {
            const sqlStr = 'INSERT INTO t_hall(cinema_id,name) VALUES(?,?);'
            conn.query(sqlStr, [cinemaId, hallName], (error, result, field) => {
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

  // 获取当前页电影
  {
    pathName: 'admin/getCurrentPageMovieSchedule',
    cb: (req, res) => {
      let {
        currentPage, pageSize, input
      } = req.query
      const start = Number((currentPage - 1) * pageSize)
      pageSize = Number(pageSize)
      let sqlStr = 'SELECT * FROM t_schedule INNER JOIN t_movie ON t_schedule.movie_id = t_movie.movie_id INNER JOIN t_cinema ON t_cinema.cinema_id = t_schedule.cinema_id WHERE t_movie.name LIKE ? ORDER BY schedule_id '
      let total
      conn.query(sqlStr, ['%' + input + '%'], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          total = result.length
        }
      })
      sqlStr = 'SELECT * FROM t_schedule INNER JOIN t_movie ON t_schedule.movie_id = t_movie.movie_id INNER JOIN t_cinema ON t_cinema.cinema_id = t_schedule.cinema_id WHERE t_movie.name LIKE ? ORDER BY schedule_id LIMIT ?,?;'
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

  // 根据名字匹配电影
  {
    pathName: 'matchMovieByName',
    cb: (req, res) => {
      const movieName = req.query.movieName
      const sqlStr = 'SELECT * FROM t_schedule INNER JOIN t_movie ON t_schedule.movie_id = t_movie.movie_id WHERE name LIKE ?;'
      conn.query(sqlStr, ['%' + movieName + '%'], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          if (result.length) {
            result = result.filter((value) => {
              return new Date(value.show_date + ',' + value.show_time) - new Date() > 0
            })
            for (let i = 0; i < result.length; i++) {
              for (let j = i + 1; j < result.length; j++) {
                if (result[i].movie_id === result[j].movie_id) {
                  result.splice(j, 1); j = j - 1
                }
              }
            }
          }
          res.json({ code: 1, data: result })
        }
      })
    }
  },

  // 获取所有电影
  {
    pathName: 'admin/getAllMovie',
    cb: (req, res) => {
      const sqlStr = 'SELECT * FROM t_movie;'
      conn.query(sqlStr, (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          res.json({ code: 1, data: result })
        }
      })
    }
  },

  // 获取影院的影厅
  {
    pathName: 'admin/getHallByCinemaId',
    cb: (req, res) => {
      const cinemaId = req.query.cinemaId
      util.log(cinemaId)
      const sqlStr = 'SELECT hall_id,name FROM t_hall WHERE cinema_id = ?;'
      conn.query(sqlStr, [cinemaId], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          util.log(result)
          res.json({ code: 1, data: result })
        }
      })
    }
  },

  // 获取排片的某天的时间段安排
  {
    pathName: 'admin/getHasScheduleDateTime',
    cb: (req, res) => {
      const {
        cinemaId, hallName, showDate
      } = req.query
      const sqlStr = 'SELECT show_time FROM t_schedule WHERE cinema_id = ? AND hall_name = ? AND show_date = ?;'
      conn.query(sqlStr, [cinemaId, hallName, showDate], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          result = JSON.parse(JSON.stringify(result))
          res.json({ code: 1, data: result })
        }
      })
    }
  },

  // 添加影院信息
  {
    pathName: 'admin/addScheduleInfo',
    cb: (req, res) => {
      const {
        movieId, cinemaId, hallName, showDate, showTime, price
      } = req.body
      const sqlStr = 'INSERT INTO t_schedule(movie_id,cinema_id,hall_name,show_date,show_time,price) VALUES(?,?,?,?,?,?);'
      conn.query(sqlStr, [movieId, cinemaId, hallName, showDate, showTime, price], (error, result, field) => {
        if (error) {
          util.log(error)
        } else {
          res.json({ code: 1 })
        }
      })
    }
  },

  // 删除影厅
  {
    pathName: 'admin/deleteMovieSchedule',
    cb: (req, res) => {
      const {
        scheduleId
      } = req.body
      if (scheduleId) {
        const sqlStr = 'DELETE FROM t_schedule WHERE schedule_id = ?'
        conn.query(sqlStr, [scheduleId], (error, result, field) => {
          if (error) {
            util.log(error)
          } else {
            res.json({ code: 1 })
          }
        })
      }
    }
  }
]

module.exports = FILM
