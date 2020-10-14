
const conn = require('../../db/db')
const util = require('../../util/util')
const moment = require('moment')

const FILM = [
  // 加载电影列表
  {
    pathName: 'getMovieList',
    cb: (req, res) => {
      const sqlStr = 'SELECT * FROM t_schedule INNER JOIN t_movie ON t_schedule.movie_id = t_movie.movie_id;'
      conn.query(sqlStr, (error, result, field) => {
        if (error) {
          util.log(error)
          res.json(util.getErrorJson('获取电影列表失败'))
        } else {
          result = JSON.parse(JSON.stringify(result))
          if (result.length) {
            result = result
              .filter(value => moment(`${value.show_date} ${value.show_time}`, 'YYYY-MM-DD HH:mm').add(1, 'M').isSameOrAfter(moment()))
              .reduce((acc, cur) => {
                !acc.some(v => v.movie_id === cur.movie_id) && acc.push(cur)
                return acc
              }, [])
            res.json({ code: 1, data: result })
          } else {
            res.json(util.getErrorJson('电影列表为空'))
          }
        }
      })
    }
  },

  // 加载电影详细信息
  {
    pathName: 'getMovieDetail',
    cb: (req, res) => {
      const movieId = req.query.movieId
      const sqlStr = 'SELECT * FROM t_movie WHERE movie_id = ? LIMIT 1;'
      conn.query(sqlStr, [movieId], (error, result, field) => {
        if (error) {
          res.json(util.getErrorJson('获取电影信息失败'))
        } else {
          result = JSON.parse(JSON.stringify(result))
          const jsonObj = result[0] ? { code: 1, data: result } : util.getErrorJson('该电影不存在')
          res.json(jsonObj)
        }
      })
    }
  },

  // 是否想看电影
  {
    type: 'post',
    pathName: 'isWishMovie',
    cb: (req, res) => {
      const { userId, movieId } = req.body
      const sqlStr = 'SELECT * FROM t_wishmovie WHERE user_id = ? AND movie_id = ? LIMIT 1;'
      conn.query(sqlStr, [userId, movieId], (error, result, field) => {
        if (error) {
          util.log(error)
          res.json(util.getErrorJson('操作失败'))
        } else {
          result = JSON.parse(JSON.stringify(result))
          const jsonObj = result[0] ? { code: 1, data: result } : util.getErrorJson('不想看')
          res.json(jsonObj)
        }
      })
    }
  },

  // 想看电影
  {
    type: 'post',
    pathName: 'wishMovie',
    cb: (req, res) => {
      const { userId, movieId } = req.body
      const sqlStr = 'INSERT INTO t_wishmovie(user_id,movie_id) VALUES(?,?)'
      conn.query(sqlStr, [userId, movieId], (error, result, field) => {
        if (error) {
          res.json(util.getErrorJson('操作失败'))
        } else {
          const sqlStr = 'SELECT wish_num from t_movie WHERE movie_id = ? LIMIT 1;'
          conn.query(sqlStr, [movieId], (error, result, field) => {
            if (error) {
              res.json(util.getErrorJson('操作失败'))
            } else {
              result = JSON.parse(JSON.stringify(result))
              if (result[0]) {
                // 更新数据库
                const sqlStr = 'UPDATE t_movie SET wish_num = ? WHERE movie_id = ?;'
                conn.query(sqlStr, [result[0].wish_num + 1, movieId], (error, result, field) => {
                  if (error) {
                    res.json({ code: -1, message: '更新信息失败' })
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
  },

  // 取消想看电影
  {
    type: 'post',
    pathName: 'cancelWishMovie',
    cb: (req, res) => {
      const { userId, movieId } = req.body
      const sqlStr = 'DELETE FROM t_wishmovie WHERE user_id = ? AND movie_id =? ;'
      conn.query(sqlStr, [userId, movieId], (error, result, field) => {
        if (error) {
          res.json({ code: -1, message: '操作失败' })
        } else {
          const sqlStr = 'SELECT wish_num from t_movie WHERE movie_id = ? LIMIT 1;'
          conn.query(sqlStr, [movieId], (error, result, field) => {
            if (error) {
              res.json({ code: -1, message: '操作失败' })
            } else {
              result = JSON.parse(JSON.stringify(result))
              if (result[0]) {
                // 更新数据库
                const sqlStr = 'UPDATE t_movie SET wish_num = ? WHERE movie_id = ?;'
                conn.query(sqlStr, [result[0].wish_num - 1, movieId], (error, result, field) => {
                  if (error) {
                    res.json({ code: -1, message: '更新信息失败' })
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
  },

  // 取消想看电影
  {
    type: 'post',
    pathName: 'cancelWishMovie',
    cb: (req, res) => {
      const { userId, movieId } = req.body
      const sqlStr = 'DELETE FROM t_wishmovie WHERE user_id = ? AND movie_id =? ;'
      conn.query(sqlStr, [userId, movieId], (error, result, field) => {
        if (error) {
          res.json({ code: -1, message: '操作失败' })
        } else {
          const sqlStr = 'SELECT wish_num from t_movie WHERE movie_id = ? LIMIT 1;'
          conn.query(sqlStr, [movieId], (error, result, field) => {
            if (error) {
              res.json({ code: -1, message: '操作失败' })
            } else {
              result = JSON.parse(JSON.stringify(result))
              if (result[0]) {
                // 更新数据库
                const sqlStr = 'UPDATE t_movie SET wish_num = ? WHERE movie_id = ?;'
                conn.query(sqlStr, [result[0].wish_num - 1, movieId], (error, result, field) => {
                  if (error) {
                    res.json({ code: -1, message: '更新信息失败' })
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
  },

  // 获取当前用户评论
  {
    pathName: 'getUserComment',
    cb: (req, res) => {
      const { userId, movieId } = req.query
      const sqlStr = 'SELECT * FROM t_comment WHERE user_id = ? AND movie_id= ? LIMIT 1;'
      conn.query(sqlStr, [userId, movieId], (error, result, field) => {
        if (error) {
          util.log(error)
          res.json({ code: -1, message: '操作失败' })
        } else {
          result = JSON.parse(JSON.stringify(result))
          if (result[0]) {
            res.json({ code: 1, data: result[0] })
          } else {
            res.json({ code: -1, message: '用户未评论' })
          }
        }
      })
    }
  },

  // 获取所有用户通过审核的评论
  {
    pathName: 'getAllUserPassComment',
    cb: (req, res) => {
      const {
        movieId
      } = req.query
      const sqlStr = 'SELECT * FROM t_user user INNER JOIN t_comment comment ON user.user_id = comment.user_id WHERE comment.movie_id = ? AND comment.is_pass = ? ;'
      conn.query(sqlStr, [movieId, 1], (error, result, field) => {
        if (error) {
          util.log(error)
          res.json({ code: -1, message: '操作失败' })
        } else {
          result = JSON.parse(JSON.stringify(result))
          if (result) {
            res.json({ code: 1, data: result })
          } else {
            res.json({ code: -1, message: '未评论' })
          }
        }
      })
    }
  },

  // 更新用户评论
  {
    type: 'post',
    pathName: 'updateUserComment',
    cb: (req, res) => {
      const { userId, movieId, score, commentContent, commentDate } = req.body
      const sqlStr = 'SELECT comment_id from t_comment WHERE user_id = ? AND movie_id = ? LIMIT 1'
      conn.query(sqlStr, [userId, movieId], (error, result, field) => {
        if (error) {
          res.json({ code: -1, message: '操作失败' })
        } else {
          result = JSON.parse(JSON.stringify(result))
          if (result[0]) {
            // 评论存在
            // 更新
            const sqlStr = 'UPDATE t_comment SET user_score = ?, comment_content = ?, comment_date = ?,support_num = ?,is_pass = ?,support_user = ? WHERE comment_id = ? ;'
            conn.query(sqlStr, [score, commentContent, commentDate, 0, 0, undefined, result[0].comment_id], (error, result, field) => {
              if (error) {
                res.json({ code: -1, message: '更新评论失败' })
              } else {
                res.json({ code: 1 })
              }
            })
          } else {
            // 评论不存在
            const sqlStr = 'INSERT INTO t_comment(user_id,movie_id,user_score,comment_content,comment_date,support_num,is_pass) VALUES(?,?,?,?,?,?,?)'
            conn.query(sqlStr, [userId, movieId, score, commentContent, commentDate, 0, 0], (error, result, field) => {
              if (error) {
                util.log(error)
                res.json({ code: -1, message: '操作失败' })
              } else {
                res.json({ code: 1 })
              }
            })
          }
        }
      })
    }
  },

  // 获取当前评论
  {
    pathName: 'getCommentByID',
    cb: (req, res) => {
      const {
        commentId
      } = req.query
      const sqlStr = 'SELECT * FROM t_comment WHERE comment_id = ? LIMIT 1;'
      conn.query(sqlStr, [commentId], (error, result, field) => {
        if (error) {
          util.log(error)
          res.json({ code: -1, message: '操作失败' })
        } else {
          result = JSON.parse(JSON.stringify(result))
          if (result[0]) {
            res.json({ code: 1, data: result[0] })
          } else {
            res.json({ code: -1, message: '用户未评论' })
          }
        }
      })
    }
  },

  // 更新当前评论的用户点赞
  {
    type: 'post',
    pathName: 'updateUserSupport',
    cb: (req, res) => {
      const {
        commentId,
        supportNum,
        supportUser
      } = req.body
      const sqlStr = 'UPDATE t_comment SET support_num = ? , support_user = ? WHERE comment_id = ?;'
      conn.query(sqlStr, [supportNum, supportUser, commentId], (error, result, field) => {
        if (error) {
          util.log(error)
          res.json({ code: -1, message: '操作失败' })
        } else {
          res.json({ code: 1 })
        }
      })
    }
  },

  // 加载影院列表
  {
    pathName: 'getCinemaList',
    cb: (req, res) => {
      const sqlStr = 'SELECT * FROM t_schedule INNER JOIN t_cinema ON t_schedule.cinema_id = t_cinema.cinema_id INNER JOIN t_movie ON t_schedule.movie_id = t_movie.movie_id;'
      conn.query(sqlStr, (error, result, field) => {
        if (error) {
          res.json({ code: -1, message: '获取影院列表失败' })
        } else {
          result = JSON.parse(JSON.stringify(result))
          if (result.length) {
            result = result.filter((value) => {
              return new Date(value.show_date + ',' + value.show_time) - new Date() > 0
            })
            for (let i = 0; i < result.length; i++) {
              for (let j = i + 1; j < result.length; j++) {
                if (result[i].cinema_id === result[j].cinema_id) {
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

  // 加载当前影院详细信息
  {
    pathName: 'getCurrentCinemaDetail',
    cb: (req, res) => {
      const cinemaId = req.query.cinemaId
      const sqlStr = 'SELECT * FROM t_cinema WHERE cinema_id = ? LIMIT 1;'
      conn.query(sqlStr, [cinemaId], (error, result, field) => {
        if (error) {
          util.log(error)
          res.json({ code: -1, message: '获取当前影院信息失败' })
        } else {
          result = JSON.parse(JSON.stringify(result))
          if (result[0]) {
            res.json({ code: 1, data: result[0] })
          } else {
            res.json({ code: -1, message: '影院不存在' })
          }
        }
      })
    }
  },

  // 加载当前影院排片
  {
    pathName: 'getCurrentCinemaMovieSchedule',
    cb: (req, res) => {
      const cinemaId = req.query.cinemaId
      util.log(cinemaId)
      let sqlStr = 'SELECT * FROM t_schedule WHERE cinema_id = ?;'
      conn.query(sqlStr, [cinemaId], (error, result, field) => {
        if (error) {
          util.log(error)
          res.json({ code: -1, message: '获取当前影院排片信息失败' })
        } else {
          result = JSON.parse(JSON.stringify(result))
          if (result) {
            let tempMovieArr = []
            result.forEach((value) => {
              if (new Date() - new Date(value.show_date + ',' + value.show_time) <= 0) {
                tempMovieArr.push(value.movie_id)
              }
            })
            tempMovieArr = Array.from(new Set(tempMovieArr))
            const movieArray = []
            const movieScheduleArray = []
            tempMovieArr.forEach((value) => {
              sqlStr = 'SELECT * FROM t_movie WHERE movie_id = ? LIMIT 1;'
              conn.query(sqlStr, [value], (error, result, field) => {
                if (error) {
                  util.log(error)
                } else {
                  result = JSON.parse(JSON.stringify(result))
                  if (result[0]) {
                    movieArray.push(result[0])
                  }
                }
              })
              sqlStr = 'SELECT * FROM t_schedule schedule INNER JOIN t_movie movie ON schedule.movie_id = movie.movie_id WHERE schedule.movie_id = ? AND schedule.cinema_id = ?;'
              conn.query(sqlStr, [value, cinemaId], (error, result, field) => {
                if (error) {
                  util.log(error)
                } else {
                  result = JSON.parse(JSON.stringify(result))
                  if (result) {
                    movieScheduleArray.push(result)
                  }
                }
              })
            })
            setTimeout(() => {
              res.json({
                code: 1,
                data: {
                  hasMovieInfo: movieArray,
                  movieScheduleInfo: movieScheduleArray
                }
              })
            }, 500)
          } else {
            res.json({ code: -1, message: '当前影院排片信息为空' })
          }
        }
      })
    }
  },

  // 加载当前影院详细信息
  {
    pathName: 'getScheduleById',
    cb: (req, res) => {
      const scheduleId = req.query.scheduleId
      const sqlStr = 'SELECT * FROM t_schedule WHERE schedule_id = ? LIMIT 1;'
      conn.query(sqlStr, [scheduleId], (error, result, field) => {
        if (error) {
          util.log(error)
          res.json({ code: -1, message: '获取当前排片信息失败' })
        } else {
          result = JSON.parse(JSON.stringify(result))
          if (result[0]) {
            res.json({ code: 1, data: result[0] })
          } else {
            res.json({ code: -1, message: '排片信息不存在' })
          }
        }
      })
    }
  },

  // 加载当前影院详细信息
  {
    type: 'put',
    pathName: 'updateScheduleSeat',
    cb: (req, res) => {
      const {
        scheduleId,
        seatInfo
      } = req.body
      const sqlStr = 'UPDATE t_schedule SET seat_info = ? WHERE schedule_id = ? LIMIT 1;'
      conn.query(sqlStr, [seatInfo, scheduleId], (error, result, field) => {
        if (error) {
          util.log(error)
          res.json({ code: -1, message: '更新排片座位信息失败' })
        } else {
          res.json({ code: 1, data: result[0] })
        }
      })
    }
  },

  // 加载当前电影排片
  {
    pathName: 'getCurrentMovieSchedule',
    cb: (req, res) => {
      const movieId = req.query.movieId
      let sqlStr = 'SELECT * FROM t_schedule WHERE movie_id = ?;'
      conn.query(sqlStr, [movieId], (error, result, field) => {
        if (error) {
          util.log(error)
          res.json({ code: -1, message: '获取当前影院排片信息失败' })
        } else {
          result = JSON.parse(JSON.stringify(result))
          if (result) {
            let tempDateArr = []
            result.forEach((value) => {
              if (new Date() - new Date(value.show_date + ',' + value.show_time) <= 0) {
                tempDateArr.push(value.show_date)
              }
            })
            tempDateArr = Array.from(new Set(tempDateArr))
            tempDateArr.sort((a, b) => {
              return new Date(a) - new Date(b)
            })
            const cinemaArray = []
            const cinemaScheduleArray = []
            tempDateArr.forEach((value) => {
              sqlStr = 'SELECT * FROM t_schedule WHERE show_date = ?'
              conn.query(sqlStr, [value], (error, result, field) => {
                if (error) {
                  util.log(error)
                } else {
                  result = JSON.parse(JSON.stringify(result))
                  if (result) {
                    cinemaArray.push(result)
                  }
                }
              })
              sqlStr = 'SELECT * FROM t_schedule schedule INNER JOIN t_cinema cinema ON schedule.cinema_id = cinema.cinema_id WHERE schedule.movie_id = ? AND schedule.show_date = ?;'
              conn.query(sqlStr, [movieId, value], (error, result, field) => {
                if (error) {
                  util.log(error)
                } else {
                  result = JSON.parse(JSON.stringify(result))
                  if (result) {
                    cinemaScheduleArray.push(result)
                  }
                }
              })
            })
            setTimeout(() => {
              res.json({
                code: 1,
                data: {
                  hasCinemaInfo: cinemaArray,
                  cinemaScheduleInfo: cinemaScheduleArray
                }
              })
            }, 500)
          } else {
            res.json({ code: -1, message: '当前电影排片信息为空' })
          }
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

  // 根据名字匹配影院
  {
    pathName: 'matchCinemaByName',
    cb: (req, res) => {
      const cinemaName = req.query.cinemaName
      const sqlStr = 'SELECT * FROM t_schedule INNER JOIN t_cinema ON t_schedule.cinema_id = t_cinema.cinema_id INNER JOIN t_movie ON t_schedule.movie_id = t_movie.movie_id WHERE cinema_name LIKE ?;'
      conn.query(sqlStr, ['%' + cinemaName + '%'], (error, result, field) => {
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
                if (result[i].cinema_id === result[j].cinema_id) {
                  result.splice(j, 1); j = j - 1
                }
              }
            }
          }
          res.json({ code: 1, data: result })
        }
      })
    }
  }
]

module.exports = FILM
