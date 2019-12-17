import transformPath from './transformPath'
import { isString, isEmpty, getType, isPlainObject } from './utils'
import { isBoolean } from 'util'

function getNamespaceAndApiName (name) {
    checkType(name, 'String', 'name')
    let apiNames = name.trim()
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
    /* istanbul ignore next */
    if (type !== t) {
        throw new Error(`Invalid parameter: prop "${name}" expected ${t}, got ${type}.`)
    }
    return true
}

export function injectParams (api, params, opts) {
    if (isPlainObject(params)) {
        let keys = Object.keys(params)
        let ps = Array.isArray(api.params) ? api.params : isBoolean(api.params) ? keys : []
        let ds = Array.isArray(api.body) ? api.body : isBoolean(api.body) ? keys : []
        keys.forEach(key => {
            let inRange = false
            if (ps.findIndex(p => p === key) !== -1) {
                inRange = true
                if (!opts.params) opts.params = {}
                opts.params[key] = params[key]
            }
            if (ds.findIndex(p => p === key) !== -1) {
                inRange = true
                if (!opts.data) opts.data = {}
                opts.data[key] = params[key]
            }
            if (!inRange) {
                if (['get', 'delete', 'head', 'options'].indexOf(api.method.toLowerCase()) !== -1) {
                    if (!opts.params) opts.params = {}
                    opts.params[key] = params[key]
                } else {
                    if (!opts.data) opts.data = {}
                    opts.data[key] = params[key]
                }
            }
        })
    } else {
        if (!api.params && !api.body) {
            if (['get', 'delete', 'head', 'options'].indexOf(api.method.toLowerCase()) !== -1) {
                opts.params = params
            } else {
                opts.data = params
            }
        } else {
            if (api.params) {
                opts.params = params
            }
            if (api.body) {
                opts.data = params
            }
        }
    }
    return opts
}

export function injectResponseType (type) {
    let legalTypes = ['', 'arraybuffer', 'blob', 'document', 'json', 'text']
    let defaultType = 'json'
    if (type === undefined) type = defaultType
    if (type) type = type.toLowerCase()
    if (legalTypes.indexOf(type) === -1) {
        throw new Error(`Invalid reponse type: expected ['', 'arraybuffer', 'blob', 'document', 'json', 'text'], got ${type}`)
    }
    return type
}

export default function (config, apis, {name, params = {}, headers = {}}) {
    /* istanbul ignore else */
    if (isEmpty(name)) {
        throw new Error(`Invalid parameter: prop api name cannot be empty.`)
    }
    /* istanbul ignore else */
    if (!isString(name)) {
        throw new Error(`Invalid parameter: prop api name expected String, got ${getType(name)}.`)
    }
    let [namespace, apiName] = getNamespaceAndApiName(name)
    let apiList = apis[namespace]
    if (!apiList) throw new Error(`Not Found: cannot find ${namespace} module.`)
    let index = apiList.findIndex(api => api.name === apiName)
    if (index === -1) throw new Error(`Not Found: cannot find ${apiName} api in ${namespace} module.`)
    let targetApi = JSON.parse(JSON.stringify(apiList[index]))
    if (!targetApi.method) throw new Error(`Method Empty: http method cannot be empty ${name} => ${JSON.stringify(targetApi)}.`)
    targetApi.path = transformPath(config, targetApi.path, params, targetApi.mock)
    let requestObj = {
        url: targetApi.path,
        method: targetApi.method,
        desc: targetApi.desc,
        responseType: injectResponseType(targetApi.responseType),
        headers
    }
    requestObj = injectParams(targetApi, params, requestObj)
    return requestObj
}