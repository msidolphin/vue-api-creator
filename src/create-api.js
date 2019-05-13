import {createAxios} from './create-axios'
import {handleResponse} from './response-handler'
import {extend} from './extend'

function isApi (target) {
  return (target.api !== undefined && Object.prototype.toString.call(target.api) === '[object Array]') || target.BASE_URL !== undefined
}

function isNull (target) {
  return target === undefined || target === null
}

export function getPath (baseUrl, path) {
  if (!baseUrl) baseUrl = '/'
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/'))
  }
  if (!baseUrl.startsWith('/')) {
    baseUrl = '/' + baseUrl
  }
  let p = path
  if (p.startsWith('/')) p = p.substring(p.indexOf('/') + 1)
  p = `${baseUrl !== '/' ? baseUrl : ''}${p ? '/' + p : ''}`
  if (p === '/') p = ''
  return p
}

export function getApi (paths, target) {
  let path = paths.join('/')
  let apis = []
  if (target.api) {
    target.api.forEach(i => {
      if (isNull(i.name)) {
        throw new Error(`${path}: api name cannot be undefined or null.`)
      }
      if (isNull(i.path)) {
        throw new Error(`${path}/${i.name}: api path cannot be undefined or null.`)
      }
      i.path = getPath(target.BASE_URL, i.path)
      apis.push(i)
    })
  }
  return apis
}

/**
 * @description 数据扁平化处理，遍历树获取所有的路径并挂载叶子节点的api
 * @param {Object} target api入口
 */
export function createApi (target, apis = {}, paths = [], level = 0) {
  if (isApi(target)) {
    apis[paths.join('/')] = getApi(paths, target)
  } else {
    Object.keys(target).forEach((name) => {
      paths[level] = name
      if (paths.length > level + 1) {
        paths.splice(level + 1, paths.length - level + 1)
      }
      if (!isApi(target[name])) {
        createApi(target[name], apis, paths, level + 1)
      } else {
        apis[paths.join('/')] = getApi(paths, target[name])
      }
    })
  }
  return apis
}

function getNamespaceAndApiName (name) {
  checkType(name, 'String', 'name')
  let apiNames = name.trim()
  if (!apiNames) throw new Error('prop "name" cannot be empty.')
  let apiNameArray = apiNames.split('/')
  let apiName = apiNameArray[apiNameArray.length - 1]
  apiNameArray.splice(apiNameArray.length - 1, 1)
  let namespace = apiNameArray.join('/')
  return [
    namespace,
    apiName
  ]
}

function checkType (target, t, name) {
  let type = Object.prototype.toString.call(target).replace(/\]/g, '').split(' ')[1]
  if (type !== t) {
    throw new Error(`Invalid parameter: prop "${name}" expected ${t}, got ${type}.`)
  }
  return true
}

export default {
  install: (Vue, settings = {}) => {
    let defaultOpts = {}

    let opts = extend(true, defaultOpts, settings)

    if (!opts.modules) throw new Error(`Invalid parameter: option "modules" expected Object, got empty.`)

    const apis = createApi(opts.modules)

    const baseUrl = opts.axios && opts.axios.baseURL ? opts.axios.baseURL : ''

    opts.axios && opts.axios.baseURL && delete opts.axios.baseURL

    const axios = createAxios(opts.axios)

    const mockBaseUrl = opts.mock

    async function request (options) {
      if (opts && opts.beforeRequest && typeof opts.beforeRequest === 'function') {
        opts.beforeRequest(options)
      }
      // let token = Cookie.get(appConfig.cookie.TOKEN)
      // if (!options.headers) options.headers = {}
      // if (token) {
      //   options.headers[appConfig.headers.ACCESS_TOKEN] = token
      // }
      // // 携带浏览器标识
      // let browser = getBrowser()
      // if (browser) {
      //   options.headers[appConfig.headers.BROWSER] = browser
      // }
      // let os = getOS()
      // if (os) {
      //   options.headers[appConfig.headers.OS] = os
      // }
      return handleResponse(Vue, await axios.request(options).catch(err => { console.error(err) }))
    }

    async function http (name, params, headers, opts) {
      let [namespace, apiName] = getNamespaceAndApiName(name)
      let apiList = apis[namespace]
      // debugger
      if (!apiList) throw new Error(`Not Found: cannot find ${namespace} module.`)
      let index = apiList.findIndex(api => api.name === apiName)
      if (index === -1) throw new Error(`Not Found: cannot find ${apiName} api in ${namespace} module.`)
      let targetApi = JSON.parse(JSON.stringify(apiList[index]))
      if (!targetApi) throw new Error(`Not Found: cannot find ${apiName} api in ${namespace} module.`)

      if (!targetApi.method) throw new Error(`Method Empty: http method cannot be empty ${name} => ${JSON.stringify(targetApi)}.`)
      let path = ''
      if (targetApi.mock) {
        path = mockBaseUrl ? mockBaseUrl + targetApi.path : targetApi.path
      } else {
        path = baseUrl ? baseUrl + targetApi.path : targetApi.path
      }
      // dynamic path
      if (path.indexOf('{') !== -1 && path.indexOf('}') !== -1) {
        let newPath = ''
        let _paths = path.split('/')
        let paths = _paths ? _paths.filter(ii => ii) : [] // igore empty
        for (let i = 0; i < paths.length; ++i) {
          let matcher = paths[i].match(/^\{(\w+)\}$/)
          if (!matcher) {
            // 非动态
            newPath = newPath + `/${paths[i]}`
          } else {
            newPath += `/${params[matcher[1]]}`
            delete params[matcher[1]]
          }
        }
        targetApi.path = newPath
      } else {
        targetApi.path = path
      }
      let requestObj = {
        url: targetApi.path,
        method: targetApi.method,
        headers,
        ...opts
      }
      // params
      if (['get', 'delete', 'head', 'options'].indexOf(targetApi.method.toLowerCase()) !== -1) {
        requestObj.params = params
      } else {
        requestObj.data = params
      }

      let resp = await request(requestObj)
      return resp
    }
    Vue.prototype.$api = http
  }
}
