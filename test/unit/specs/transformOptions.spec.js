import transformOptions from '@/transformOptions'
import transformApi from '@/transformApi'
import { tryCatch } from './utils'

describe('transformOptions.js', () => {
    const modules = {
        pub: {
            BASE_URL: '/pub',
            api: [
                {
                    name: 'list',
                    desc: 'list',
                    method: 'GET',
                    path: 'list'
                },
                {
                    name: 'detail',
                    desc: 'detail',
                    path: 'GET',
                    path: 'detail'
                }
            ]
        },
        cms: {
            ad: {
                BASE_URL: '/cms/ad',
                api: [
                    {
                        name: 'list',
                        desc: 'list',
                        method: 'GET',
                        path: 'list'
                    },
                    {
                        name: 'detail',
                        desc: 'detail',
                        path: 'GET',
                        path: 'detail'
                    }
                ]
            },
            news: {
                BASE_URL: '/cms/news',
                api: [
                    {
                        name: 'list',
                        desc: 'list',
                        method: 'GET',
                        path: 'list'
                    },
                    {
                        name: 'detail',
                        desc: 'detail',
                        path: 'GET',
                        path: 'detail'
                    },
                    {
                        name: 'edit',
                        desc: 'edit',
                        path: 'edit'
                    },
                    {
                        name: 'get',
                        desc: 'get',
                        path: 'get',
                        method: 'get'
                    },
                    {
                        name: 'post',
                        desc: 'post',
                        path: 'post',
                        method: 'post'
                    },
                    {
                        name: 'put',
                        desc: 'put',
                        path: 'put',
                        method: 'put'
                    },
                    {
                        name: 'patch',
                        desc: 'patch',
                        path: 'patch',
                        method: 'patch'
                    }
                ]
            }
        }
    }
    const config = {
        baseURL: '/api',
        mock: 'https://www.mock.com'
    }
    it('normally', () => {
        const apis = transformApi(modules)
        const opts = transformOptions(config, apis, {
            name: 'cms/news/list'
        })
        expect(opts).toEqual({
            url: '/api/cms/news/list',
            method: 'GET',
            desc: 'list',
            headers: {},
            params: {}
        })
    })

    it('data or params', () => {
        const apis = transformApi(modules)
        expect(JSON.stringify(transformOptions(config, apis, {name: 'cms/news/get', params: {a: 1}}))).toMatch('params')
        expect(JSON.stringify(transformOptions(config, apis, {name: 'cms/news/post', params: {a: 1}}))).toMatch('data')
        expect(JSON.stringify(transformOptions(config, apis, {name: 'cms/news/put', params: {a: 1}}))).toMatch('data')
        expect(JSON.stringify(transformOptions(config, apis, {name: 'cms/news/patch', params: {a: 1}}))).toMatch('data')
    })

    describe('errors', () => {
        it('When api name is empty, the error message should be [Invalid parameter: prop api name cannot be empty]', () => {
            const apis = transformApi(modules)
            tryCatch(() => {
                transformOptions(config, apis, {name: ''})
            }, 'Invalid parameter: prop api name cannot be empty')
            tryCatch(() => {
                transformOptions(config, apis, {name: '  '})
            }, 'Invalid parameter: prop api name cannot be empty')
            tryCatch(() => {
                transformOptions(config, apis, {name: undefined})
            }, 'Invalid parameter: prop api name cannot be empty')
            tryCatch(() => {
                transformOptions(config, apis, {name: null})
            }, 'Invalid parameter: prop api name cannot be empty')
        })

        it('When api name is not a String, the error message should be [Invaild parameter: prop api name expected String, got ${type}]', () => {
            const apis = transformApi(modules)
            tryCatch(() => {
                transformOptions(config, apis, {name: []})
            }, 'Invalid parameter: prop api name expected String, got Array')
            tryCatch(() => {
                transformOptions(config, apis, {name: {}})
            }, 'Invalid parameter: prop api name expected String, got Object')
            tryCatch(() => {
                transformOptions(config, apis, {name: new Map()})
            }, 'Invalid parameter: prop api name expected String, got Map')
        })

        it('When module not fcound, the error message should be [Not Found: cannot find ${namesapce} module]', () => {
            const apis = transformApi(modules)
            tryCatch(() => {
                transformOptions(config, apis, {name: 'fms/order/list'})
            }, 'Not Found: cannot find fms/order module')
        })
        it('When api not fcound, the error message should be [Not Found: cannot find ${api} in ${namesapce} module]', () => {
            const apis = transformApi(modules)
            tryCatch(() => {
                transformOptions(config, apis, {name: 'cms/news/save'})
            }, 'Not Found: cannot find save api in cms/news module')
        })
        it('When http method is empty, the error message should be [Method Empty: http method cannot be empty]', () => {
            const apis = transformApi(modules)
            tryCatch(() => {
                transformOptions(config, apis, {name: 'cms/news/edit'})
            }, 'Method Empty: http method cannot be empty')
        })
    })
})