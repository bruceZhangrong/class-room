const moment = require('moment')

const UTIL = {
  /* 生成指定长度的随机数 */
  randomCode (length) {
    const chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    let result = ''
    for (let i = 0; i < length; i++) {
      const index = Math.ceil(Math.random() * 9)
      result += chars[index]
    }
    return result
  },

  log (...params) {
    params = params.map(k => typeof k !== 'object' ? `\x1B[1m\x1B[31m${k}\x1B[0m` : k)
    console.log('\n======= Log Message ========\n')
    console.log(...params)
    UTIL.writeLog(`${JSON.stringify(...params)}\r\n`)
    console.log('\n============================\n')
  },

  getErrorJson (msg, code = -1) {
    return {
      code: code,
      message: msg
    }
  },

  getCookie (cookie = '', ...names) {
    if (!cookie || !names || !names.length) {
      return []
    }
    return cookie ? names.map(name => cookie.split(';').find(v => v.includes(name)).split('=')[1]) : []
  },

  writeLog (req, res, next) {
    const fs = require('fs')
    const path = require('path')
    const name = moment().format('YYYYMMDD')
    const logPath = path.join(__dirname, `../log/${name}.log`)

    fs.appendFile(logPath, req, err => {
      if (err) {
        UTIL.log(err.code)
        throw err
      }
    })
  }
}

module.exports = UTIL
