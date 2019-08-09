import { createError, onError } from './utils'

export default function request (axios, config, options) {
    if (config && config.beforeRequest && typeof config.beforeRequest === 'function') {
        config.beforeRequest(options)
    }
    return new Promise((resolve, reject) => {
        let _config = config
        axios.request(options).then(response => {
            resolve(response)
        }).catch((err = {}) => {
            let {response = {}, request = {}} = err
            let config = response.config
            let { status: code, statusText: msg } = response
            let isInternalError = onError(_config, response)
            reject(createError(code, msg, response.data, response, config, request, isInternalError))
        })
    })
}
