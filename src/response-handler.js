const EMPTY_DATA = 'empty_data'

const errorMap = {
  [EMPTY_DATA]: {
    notify: false,
    msg: '没有数据返回，不满足规范要求，请让后端检测接口返回参数'
  },
  504: {
    notify: true,
    msg: '请求超时',
    duration: 3000
  },
  401: {
    notify: true,
    msg: '会话已过期，请重新登录',
    duration: 3000,
    shouldLogin: true // TODO
  },
  404: {
    notify: true,
    msg: '请求接口地址不存在',
    duration: 3000
  },
  400: {
    notify: true,
    msg: '请求参数错误',
    duration: 3000
  },
  403: {
    notify: true,
    msg: '无接口访问权限，请联系管理员'
  },
  500: {
    notify: false,
    duration: 3000
  }
}

export const handleResponse = (Vue, resp) => {
  return new Promise((resolve, reject) => {
    let data = resp && resp.data ? resp.data : resp
    if (!data) {
      data.code = EMPTY_DATA
    }
    let error = errorMap[data.code]
    if (error || !data.success) {
      let message = error && error.msg ? error.msg : (typeof data.data === 'string' ? data.data : data.msg)
      if (((error && error.notify) || (process.env.NODE_ENV === 'development' && data.code !== 200)) && Vue.prototype.$notify) {
        Vue.prototype.$notify.error({
          title: '请求异常',
          dangerouslyUseHTMLString: true,
          message: `<div>${message}${resp.config ? ': ' : ''}</div><div style="font-weight:bold;color:#F56C6C;">${resp.config ? resp.config.url : ''}</div>`,
          duration: error && error.duration ? error.duration : 0
        })
      }
      reject({...data, msg: message})
    } else {
      resolve(data.data ? data.data : data)
    }
  })
}
