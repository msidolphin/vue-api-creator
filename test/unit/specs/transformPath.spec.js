import transformPath from '@/transformPath'

describe('transformPath.js', () => {
    describe('not mock', () => {
        it('static path', () => {
            const config = {
                baseURL: '/api',
                mock: 'https://www.mock.com'
            }
            expect(transformPath(config, '', {}, false)).toBe('/api')
            expect(transformPath(config, '/user/list', {}, false)).toBe('/api/user/list')
        })
        it('when baseURL is function', () => {
            const config = {
                baseURL () {
                    return '/api'
                },
                mock: 'https://www.mock.com'
            }
            expect(transformPath(config, '', {}, false)).toBe('/api')
            expect(transformPath(config, '/user/list', {}, false)).toBe('/api/user/list')
        })
        it('dynamic path', () => {
            const config = {
                baseURL: '/api',
                mock: 'https://www.mock.com'
            }
            expect(transformPath(config, '/user/{id}', {id: 123}, false)).toBe('/api/user/123')
            expect(transformPath(config, '{id}', {id: 123}, false)).toBe('/api/123')
            expect(transformPath(config, '/user/{group}/{name}', {group: 'abc', name: '123'}, false)).toBe('/api/user/abc/123')
        })
    })
    describe('mock', () => {
        it('static path', () => {
            const config = {
                baseURL: '/api',
                mock: 'https://www.mock.com'
            }
            expect(transformPath(config, '/user/list', {}, true)).toBe('https://www.mock.com/user/list')
        })
        it('dynamic path', () => {
            const config = {
                baseURL: '/api',
                mock: 'https://www.mock.com'
            }
            expect(transformPath(config, '/user/{id}', {id: 123}, true)).toBe('https://www.mock.com/user/123')
            expect(transformPath(config, '/user/{group}/{name}', {group: 'abc', name: '123'}, true)).toBe('https://www.mock.com/user/abc/123')
        })
    })

    describe('errors', () => {
        it('when params is empty, the error message should be [params cannot be empty]', () => {
            try {
                const config = {
                    baseURL: '/api',
                    mock: 'https://www.mock.com'
                }
                transformPath(config, '/user/{id}')
            } catch(e) {
                expect(e.toString()).toMatch('params cannot be empty')
            }
        })
        it('when params is not a plain object, the error message should be [expected params is plain object]', () => {
            try {
                const config = {
                    baseURL: '/api',
                    mock: 'https://www.mock.com'
                }
                transformPath(config, '/user/{id}', [])
            } catch(e) {
                expect(e.toString()).toMatch('expected params is plain object')
            }
        })
    })
})