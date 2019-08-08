import { isString, getType } from './utils'

function isApi (target) {
  return (target.api !== undefined && Object.prototype.toString.call(target.api) === '[object Array]') || target.BASE_URL !== undefined
}
  
function isNull (target) {
  return target === undefined || target === null
}
  
export function getPath (baseUrl, path) {
  /* istanbul ignore else */
  if (!baseUrl) baseUrl = '/'
  if (!isString(baseUrl)) {
    throw new Error(`expected BASE_URL is String, got ${getType(baseUrl)}`)
  }
  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/'))
  }
  if (!baseUrl.startsWith('/')) {
    baseUrl = '/' + baseUrl
  }
  let p = path
  if (!p) p = ''
  if (p.startsWith('/')) p = p.substring(p.indexOf('/') + 1)
  p = `${baseUrl !== '/' ? baseUrl : ''}${p ? '/' + p : ''}`
  /* istanbul ignore next */
  if (p === '/') p = ''
  return p
}
  
function getApi (paths, target) {
  let path = paths.join('/')
  let apis = []
  /* istanbul ignore else */
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
export default function createApi (target, apis = {}, paths = [], level = 0) {
  if (isApi(target)) {
    if (!paths.join('/')) {
      apis['api'] = getApi(paths, target)
    } else {
      apis[paths.join('/')] = getApi(paths, target)
    }
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
