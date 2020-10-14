import axios from 'axios'

export default function ajax (url = '', params = {}, type = 'get') {
  type = type.toLocaleLowerCase()
  return new Promise((resolve, reject) => {
    const requestMaps = new Map([
      [['get', 'delete'], () => {
        const searchStr = Object.keys(params).reduce((res, cur, i, arr) => (res += `${cur}=${params[cur]}${i === arr.length - 1 ? '' : '&'}`), '')
        url += `?${searchStr}`
        return axios[type](url)
      }],
      [['post', 'put', 'patch'], () => axios[type](url, params)]
    ])
    let promise = null
    requestMaps.forEach((v, k) => {
      k.includes(type) && (promise = v())
    })

    promise.then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err)
    })
  })
}
