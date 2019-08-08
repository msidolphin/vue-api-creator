import transformResponse from '@/transformResponse'
import { spyFn, createSuccessResponse, createFailedResponseDueToNetwork, createFailedResponseDueToServer } from './utils'


describe('transformResponse.js', () => {
    it('afterRequest method should be called', () => {
        const fn = jest.fn()
        const config = {
            afterRequest () {
                spyFn(fn)
            }
        }
        transformResponse(createSuccessResponse(), config)
        expect(fn).toBeCalled()
    })

    it('afterRequest method can modify the response', () => {
        let response = createSuccessResponse()
        const config = {
            afterRequest (resp) {
                resp.status = 404
            },
            permanentErrors: [404]
        }
        return transformResponse(response, config).then(() => {
            expect(false).toBeTruthy()
        }).catch(err => {
            expect(err.code).toBe(404)
        })
    })

    it('when request failed, the onError method have been called', () => {
        const fn = jest.fn()
        const config = {
            permanentErrors: [404, 415, 500, 501],
            onError () {
                spyFn(fn)
            }
        }
        transformResponse(createFailedResponseDueToNetwork(), config)
        expect(fn).toBeCalled()
    })

    it('when response failed, the onError method have been called', () => {
        const fn = jest.fn()
        const config = {
            permanentErrors: [404, 415, 500, 501],
            onError () {
                spyFn(fn)
            }
        }
        transformResponse(createFailedResponseDueToServer(), config)
        expect(fn).toBeCalled()
    })    

    it('response success', () => {
        let response = createSuccessResponse()
        const config = {
            permanentErrors: [404, 415, 500, 501]
        }
        return transformResponse(response, config).then(res => {
            expect(res).toEqual(response.data.data)
        }).catch(() => {
            expect(false).toBeTruthy()
        })
    })

    it('response failed because of the network, etc', () => {
        let response = createFailedResponseDueToNetwork()
        const config = {
            permanentErrors: [404, 415, 500, 501]
        }
        return transformResponse(response, config).then(() => {
            expect(false).toBeTruthy()
        }).catch(() => {
            expect(true).toBeTruthy()
        })
    })

    it('response failed because of the server', () => {
        let response = createFailedResponseDueToServer()
        const config = {
            permanentErrors: [404, 415, 500, 501]
        }
        return transformResponse(response, config).then(() => {
            expect(false).toBeTruthy()
        }).catch(() => {
            expect(true).toBeTruthy()
        })
    })

    it('when data is empty', () => {
        return Promise.all(
            [
                transformResponse({status: 200, statusText: 'ok'}, {}),
                transformResponse({data: null, status: 200, statusText: 'ok'}, {}),
                transformResponse({data: undefined, status: 200, statusText: 'ok'}, {})
            ]
        ).catch(err => {
            console.error(err)
            expect(false).toBeTruthy()
        })
    })

    it('when response is failed and data.data is string, the error message should be equal data.data', () => {
        const msg = 'resouce is not exists'
        return transformResponse({
            status: 200,
            statusText: 'failed',
            data: {
                success: false,
                data: msg
            }
        }).then(() => {
            expect(false).toBeTruthy()
        }).catch(err => {
            expect(err.msg).toBe(msg)
        })
    })

    it('when response is failed and data.msg is exists, the error message should be equal data.msg', () => {
        const msg = 'resouce is not exists'
        return transformResponse({
            status: 200,
            statusText: 'failed',
            data: {
                success: false,
                data: null,
                msg
            }
        }).then(() => {
            expect(false).toBeTruthy()
        }).catch(err => {
            expect(err.msg).toBe(msg)
        })
    })

    it('when response is failed, data.msg and data.data are undefined , the error message should be equal statusText', () => {
        return transformResponse({
            status: 200,
            statusText: 'failed',
            data: {
                success: false
            }
        }).then(() => {
            expect(false).toBeTruthy()
        }).catch(err => {
            expect(err.msg).toBe('failed')
        })
    })
})