import {getPath, default as transformApi}  from '@/transformApi'

describe('transformApi.js', () => {
    it('flatten', () => {
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
                }
            }
        }
        expect(transformApi(modules)).toEqual({
            pub: [{
                    name: 'list',
                    desc: 'list',
                    method: 'GET',
                    path: '/pub/list'
                },
                {
                    name: 'detail',
                    desc: 'detail',
                    path: '/pub/detail'
                }
            ],
            'cms/ad': [{
                    name: 'list',
                    desc: 'list',
                    method: 'GET',
                    path: '/cms/ad/list'
                },
                {
                    name: 'detail',
                    desc: 'detail',
                    path: '/cms/ad/detail'
                }
            ],
            'cms/news': [{
                    name: 'list',
                    desc: 'list',
                    method: 'GET',
                    path: '/cms/ad/list'
                },
                {
                    name: 'detail',
                    desc: 'detail',
                    path: '/cms/ad/detail'
                }
            ]
        })
    })
    it('If modules param is legal api', () => {
        const modules = {
            BASE_URL: '/base',
            api: [
                {
                    name: 'list',
                    desc: 'list',
                    method: 'GET',
                    path: 'list'
                }
            ]
        }
        expect(transformApi(modules)).toEqual({
            api: [
                {
                    name: 'list',
                    desc: 'list',
                    method: 'GET',
                    path: '/base/list'
                }
            ]
        })
    })

    it('If name is empty, the error message should be [${path}: api name cannot be undefined or null.]', () => {
        try {
            const modules = {
                user: {
                    api: [
                        {
                            desc: 'list',
                            method: 'GET',
                            path: 'list'
                        }
                    ]
                }
            }
            transformApi(modules)
        } catch (e) {
            expect(e.toString()).toMatch('api name cannot be undefined or null')
        }
    })

    it('If path is empty, the error message should be [${path}/${i.name}: api path cannot be undefined or null.]', () => {
        try {
            const modules = {
                user: {
                    api: [
                        {
                            name: 'list',
                            desc: 'list',
                            method: 'GET'
                        }
                    ]
                }
            }
            transformApi(modules)
        } catch (e) {
            expect(e.toString()).toMatch('api path cannot be undefined or null')
        }
    })

    describe('getPath', () => {
        it('If baseUrl is empty', () => {
            expect(getPath('', '/user/list')).toBe('/user/list')
            expect(getPath(undefined, '/user/list')).toBe('/user/list')
            expect(getPath(null, '/user/list')).toBe('/user/list')
        })

        it('If baseUrl is not a String, the error message should be [expected BASE_URL is String, got ${type}]', () => {
            try {
                getPath([], '/user/list')
            } catch (e) {
                expect(e.toString()).toMatch('expected BASE_URL is String, got Array')
            }
        })

        it('If baseUrl end with /', () => {
            expect(getPath('/', '/user/list')).toBe('/user/list')
            expect(getPath('/user/', '/list')).toBe('/user/list')
        })
    
        it('If path to be equal /', () => {
            expect(getPath('/user/list', '/')).toBe('/user/list')
        })

        it(`If path is empty`, () => {
            expect(getPath('/user/list')).toBe('/user/list')
        })
    })

})