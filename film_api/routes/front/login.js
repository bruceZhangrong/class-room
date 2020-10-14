
const conn = require('../../db/db')
const svgCaptcha = require('svg-captcha')
const util = require('../../util/util')

// 用户API
const user = {}

const LOGIN = [
  // 获取手机验证码
  {
    pathName: 'getPhoneCode',
    cb: (req, res) => {
      const phone = req.query.phone
      const phoneCode = util.randomCode(4)
      if (phoneCode) {
        user[phone] = phoneCode
        res.json({ code: 1, data: phoneCode })
      } else {
        res.json({ code: -1, message: '获取验证码失败' })
      }
    }
  },

  // 获取图形验证码
  {
    pathName: 'captcha',
    cb: (req, res) => {
      const captcha = svgCaptcha.create({
        size: 4, // size of random string
        ignoreChars: '0o1i', // filter out some characters like 0o1i
        noise: 4, // number of noise lines
        color: true, //, characters will have distinct colors instead of grey, true if background option is set
        background: '#fff' // background color of the svg image
      })
      // 保存图形验证码文本
      req.session.captcha = captcha.text.toLowerCase()
      // 返回验证码数据
      res.type('svg')
      res.status(200).send(captcha.data)
    }
  },

  // 电话登录
  {
    type: 'post',
    pathName: 'phoneLogin',
    cb: (req, res) => {
      const phone = req.body.phone
      const phoneCode = req.body.phoneCode
      // 判断手机验证码是否正确
      if (user[phone] === phoneCode) {
        const sqlStr = 'SELECT * from t_user WHERE phone = ? LIMIT 1 ;'
        conn.query(sqlStr, [phone], (error, result, field) => {
          if (error) {
            res.json(util.getErrorJson('请求数据失败'))
          } else {
            result = JSON.parse(JSON.stringify(result))
            // 用户存在
            if (result[0]) {
              req.session.userId = result[0].user_id
              res.cookie('user_id', result[0].user_id)
              res.json({ code: 1 })
            } else {
              // 用户不存在
              const sqlStr = 'INSERT INTO t_user(user_name,phone,avatar,password) VALUES(?,?,?,?)'
              const avatarSrc = '/images/avatar/monkey.png'
              conn.query(sqlStr, [phone, phone, avatarSrc, 123456], (error, result, field) => {
                if (error) {
                  util.log(error)
                  res.json(util.getErrorJson('创建用户失败'))
                } else {
                  res.cookie('user_id', result.insertId)
                  res.json({ code: 1 })
                }
              })
            }
          }
        })
      } else {
        res.json(util.getErrorJson('验证码不正确'))
      }
    }
  },

  // 手机登录
  {
    type: 'post',
    pathName: 'pwdLogin',
    cb: (req, res) => {
      const name = req.body.userName
      const pwd = req.body.password
      const captcha = req.body.captcha
      // 判断验证码是否正确
      if (captcha.toLowerCase() !== req.session.captcha) {
        res.json({ code: -1, message: '验证码不正确' })
      } else {
        delete req.session.captcha
        const sqlStr = 'SELECT * from t_user WHERE user_name = ? LIMIT 1;'
        conn.query(sqlStr, [name], (error, result, field) => {
          if (error) {
            res.json({ code: -1, message: '查询用户失败' })
          } else {
            result = JSON.parse(JSON.stringify(result))
            if (result[0]) {
              if (result[0].password === pwd) {
                // 保存用户id
                req.session.userId = result[0].user_id
                res.cookie('user_id', result[0].user_id)
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
    }
  }
]

module.exports = LOGIN
