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
    console.log('\n============================\n')
  },

  getErrorJson (msg, code = -1) {
    return {
      code: code,
      message: msg
    }
  }
}

module.exports = UTIL
