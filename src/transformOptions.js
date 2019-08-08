import transformPath from './transformPath'
import { isString, isEmpty, getType } from './utils'

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
        headers
    }
    if (['get', 'delete', 'head', 'options'].indexOf(targetApi.method.toLowerCase()) !== -1) {
        requestObj.params = params
    } else {
        requestObj.data = params
    }
    return requestObj
}