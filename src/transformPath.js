import { isEmpty, isPlainObject, getType } from './utils'


function getBaseUrl (config, isMock) {
    if (isMock) return config.mock
    else if (typeof config.baseURL === 'function') return config.baseURL()
    else return config.baseURL
}

export default function transformPath (config, url, params, isMock) {
    const baseUrl = getBaseUrl(config, isMock)
    let path = url ? url : ''
    if (path.indexOf('{') !== -1 && path.indexOf('}') !== -1) {
        if (isEmpty(params)) {
            throw new Error('params cannot be empty')
        }
        if (!isPlainObject(params)) {
            throw new Error(`expected params is plain object`)
        }
        let newPath = ''
        let paths = path.split('/').filter(ii => ii)
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
        return baseUrl + newPath
    } else {
        return baseUrl + path
    }
}

