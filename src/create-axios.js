import Axios from 'axios'

export function createAxios (options = {}) {
  let axios = Axios.create({
    responseType: 'json',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    ...options
  })
  axios.interceptors.response.use(resp => {
    return Promise.resolve(resp)
  }, res => {
    let response = res.response
    if (response && response.status === 504) {
      return Promise.resolve({...res, code: 504, msg: '请求超时'})
    }
    if (response && response.status === 404) {
      return Promise.resolve({...res, code: 404, msg: '请求地址不存在'})
    }
    if (response && response.status === 500) {
      return Promise.resolve({...res, code: 500, msg: 'Internal Server Error'})
    }
    return Promise.reject(res)
  })
  return axios
}

export const createError = (code, message, data = {}) => {
  let err = new Error(message)
  err.code = code
  err.msg = message
  err.data = data
  return err
}
