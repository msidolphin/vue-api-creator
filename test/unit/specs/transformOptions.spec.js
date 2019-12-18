import transformOptions, { injectParams, injectResponseType } from '@/transformOptions'
import transformApi from '@/transformApi'
import { tryCatch } from './utils'

describe('transformOptions.js', () => {
    const modules = {
        pub: {
            BASE_URL: 'pub',
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
                    method: 'GET',
                    path: 'detail'
                },
                {
                    name: 'download',
                    desc: 'download',
                    method: 'GET',
                    path: 'download',
                    responseType: 'blob'
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
                        method: 'GET',
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
                        method: 'GET',
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
        const apis = transformApi(JSON.parse(JSON.stringify(modules)))
        const opts = transformOptions(config, apis, {
            name: 'cms/news/list'
        })
        expect(opts).toEqual({
            url: '/api/cms/news/list',
            method: 'GET',
            desc: 'list',
            responseType: 'json',
            headers: {}
        })
    })
    
    it(`response type`, () => {
        const apis = transformApi(JSON.parse(JSON.stringify(modules)))
        const opts = transformOptions(config, apis, {
            name: 'pub/download'
        })
        expect(opts).toEqual({
            url: '/api/pub/download',
            method: 'GET',
            desc: 'download',
            responseType: 'blob',
            headers: {}
        })
    })

    it('invalid response type', () => {
        tryCatch(() => {
            injectResponseType(null)
        }, `Invalid reponse type: expected ['', 'arraybuffer', 'blob', 'document', 'json', 'text'], got null`)
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

    describe('inject params', () => {
 
        it('normally with plain object', () => {
            const postApi = {
                name: 'test',
                method: 'POST',
                path: 'test'
            }
            const getApi = {
                name: 'test',
                method: 'GET',
                path: 'test'
            }
            let opts1 = injectParams(postApi, {
                id: '123',
                name: 'bob',
                age: 18,
                birthday: '1995-08-12'
            }, {})
            let opts2 = injectParams(getApi, {
                id: '123',
                name: 'bob',
                age: 18,
                birthday: '1995-08-12'
            }, {})
            expect(opts1).toEqual({
                data: {
                    id: '123',
                    name: 'bob',
                    age: 18,
                    birthday: '1995-08-12'
                }
            })
            expect(opts2).toEqual({
                params: {
                    id: '123',
                    name: 'bob',
                    age: 18,
                    birthday: '1995-08-12'
                }
            })
        })

        it('normally whit not a plain object', () => {
            const postApi = {
                name: 'test',
                method: 'POST',
                path: 'test'
            }
            const getApi = {
                name: 'test',
                method: 'GET',
                path: 'test'
            }
            let opts1 = injectParams(postApi, [1, 2, 3], {})
            let opts2 = injectParams(getApi, 1, {})
            expect(opts1).toEqual({
                data: [1, 2, 3]
            })
            expect(opts2).toEqual({
                params: 1
            })
        })

        it('test params and body config with plain object', () => {
            const api = {
                name: 'test',
                method: 'POST',
                path: 'test',
                body: ['name', 'age'],
                params: ['id']
            }    
            let opts = injectParams(api, {
                id: '123',
                name: 'bob',
                age: 18,
                birthday: '1995-08-12'
            }, {})
            expect(opts).toEqual({
                data: {
                    name: 'bob',
                    age: 18,
                    birthday: '1995-08-12'
                },
                params: {
                    id: '123'
                }
            })
        })

        it('test params and body config when not a plain object', () => {
            const apiWithBody = {
                name: 'test',
                method: 'DELETE',
                path: 'test',
                body: true
            }
            let opts1 = injectParams(apiWithBody, [1, 2, 3], {})
            let opts2 = injectParams(apiWithBody, 1, {})
            let opts3 = injectParams(apiWithBody, 'abc', {})
            let opts4 = injectParams(apiWithBody, true, {})
            expect(opts1).toEqual({data: [1, 2, 3]})
            expect(opts2).toEqual({data: 1})
            expect(opts3).toEqual({data: 'abc'})
            expect(opts4).toEqual({data: true})
            const apiWithParams = {
                name: 'test',
                method: 'DELETE',
                path: 'test',
                params: true
            }
            let opts5 = injectParams(apiWithParams, [1, 2, 3], {})
            let opts6 = injectParams(apiWithParams, 1, {})
            let opts7 = injectParams(apiWithParams, 'abc', {})
            let opts8 = injectParams(apiWithParams, true, {})
            expect(opts5).toEqual({params: [1, 2, 3]})
            expect(opts6).toEqual({params: 1})
            expect(opts7).toEqual({params: 'abc'})
            expect(opts8).toEqual({params: true})
        })

        test('when params and body type is boolean', () => {
            const api = {
                name: 'test',
                method: 'POST',
                path: 'test',
                body: true,
                params: true
            }    
            let opts = injectParams(api, {
                id: '123',
                name: 'bob',
                age: 18,
                birthday: '1995-08-12'
            }, {})
            expect(opts).toEqual({
                data: {
                    id: '123',
                    name: 'bob',
                    age: 18,
                    birthday: '1995-08-12'
                },
                params: {
                    id: '123',
                    name: 'bob',
                    age: 18,
                    birthday: '1995-08-12'
                }
            })
        })

        test('enable encodeURIComponent', () => {
            const api = {
                name: 'test',
                method: 'GET',
                path: 'test',
                params: ['name']
            }   
            let opts = injectParams(api, {
                id: '123',
                name: '张三',
                age: 18,
                birthday: '1995-08-12'
            }, {}, {
                enableEncodeURIComponent: true
            })
            expect(opts).toEqual({
                params: {
                    id: '123',
                    name: '%E5%BC%A0%E4%B8%89',
                    age: '18',
                    birthday: '1995-08-12'
                }
            })
        })

    })

})