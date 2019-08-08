export function createError(code, msg, data, response = {}, config = {}, request = {}) {
    return {
        code,
        msg,
        data,
        success: false,
        response,
        config,
        request
    }
}

export function onError (config, res) {
    let {
        data = {}, 
        status: code,
        config: $config,
        request = {},
        statusText: msg
    } = res
    if (config && config.onError && typeof config.onError === 'function') {
        config.onError(
            createError(
                code,
                data && typeof data.data === 'string' ? data.data : data && data.msg ? data.msg : msg,
                data,
                res,
                $config,
                request
            )
        )
    }
}

export const isString = function (target) {
    return Object.prototype.toString.call(target) === '[object String]'
}

export const getType = function (target) {
    return Object.prototype.toString.call(target).replace(/\]/g, '').split(' ')[1]
}

export const isNull = function (val) {
    return val === null
}

export const isUndefined = function (val) {
    return val === undefined
}

export const isEmpty = function (val) {
    if (isString(val)) {
        return val.trim() === ''
    }
    return isNull(val) || isUndefined(val)
}

export const isPlainObject = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]' && Object.getPrototypeOf(obj) === Object.prototype
}