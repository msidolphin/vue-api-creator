import { createError, onError } from './utils'



export default function transformResponse (res, config) {
    if (config && config.afterRequest && typeof config.afterRequest === 'function') {
        config.afterRequest(res)
    }
    let {
        data = {}, // if the data is empty and status not in permanentErrors, considered response to be successful 
        status: statusCode,
        config: $config,
        request = {},
        statusText: msg
    } = res
    if (!data) data = {}
    return new Promise((resolve, reject) => {
        let permanentErrors = config && config.permanentErrors || []
        if (permanentErrors.indexOf(statusCode) !== -1) {
            onError(config, res)
            reject({
                code: statusCode,
                msg,
                data,
                success: false,
                config: $config,
                request,
                response: res
            })
        } else {
            statusCode = data.code ? data.code : 200
            if ((data.success !== undefined && !data.success) || permanentErrors.indexOf(statusCode) !== -1) {
                onError(config, res)
                reject(createError(
                    data.code, // code
                    data && typeof data.data === 'string' ? data.data : data.msg ? data.msg : msg,
                    data,
                    res,
                    $config,
                    request
                ))
            } else {
                resolve(data.data)
            }
        }
    })
}
