import {extend} from './extend'
import transformApi from './transformApi'
import transformOptios from './transformOptions'
import xhr from './xhr'
import transformResponse from './transformResponse'
import { createAxios } from './create-axios'
import { isPlainObject } from './utils'

/**
 * modules
 * permanentErrors: [404, 415, 500, 501, 429]
 * axios axios配置
 * beforeRequest
 * afterRequest
 * baseURL
 * mock
 * returnOriginResponse
 */
export default {
  install: (Vue, settings) => {
    let defaultconfig = {
      permanentErrors: [500, 404, 504, 501, 415, 429],
      axios: null
    }
    let config = extend(true, defaultconfig, settings)
    /* istanbul ignore next */
    if (!config.baseURL && config.axios && config.axios.baseURL) {
      config.baseURL = config.axios.baseURL
    }
    /* istanbul ignore next */
    if (config.axios && config.axios.baseURL) delete config.axios.baseURL
    const axios = config.axios && !isPlainObject(config.axios) ? config.axios : createAxios(config)
    /* istanbul ignore next */
    if (!config.modules) {
      throw new Error(`Invalid parameter: option "modules" expected Object, got empty.`)
    }
    const apis = transformApi(JSON.parse(JSON.stringify(config.modules)))
    Vue.prototype.$api = function http (name, params, headers = {}, returnOriginResponse = !!config.returnOriginResponse) {
      /* istanbul ignore next */
      if (!isPlainObject(headers)) {
        returnOriginResponse = !!headers
        headers = {}
      }
      return new Promise((resolve, reject) => {
        xhr(axios, config, transformOptios(config, apis, {name, params: params ? JSON.parse(JSON.stringify( params)) : {}, headers})).then(response => {
          transformResponse(response, config, returnOriginResponse).then(result => {
            resolve(result)
          }).catch(err => {
            reject(err)
          })
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}