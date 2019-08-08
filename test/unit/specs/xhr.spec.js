import xhr from '@/xhr'
import axios from 'axios'
import { spyFn } from './utils'

jest.mock('axios')

describe('xhr.js', () => {

    it('beforeRequest should be called', () => {
        const fn = jest.fn()
        xhr(axios, {
            beforeRequest () {
                spyFn(fn)
            }
        }, {
            method: 'GET',
            url: '/api'
        }).catch(() => {})
        expect(fn).toBeCalled()
    })

    it('request successfully', async () => {
        axios.request.mockResolvedValueOnce({data: 'test'})
        return xhr(axios, {}, {
            method: 'GET',
            url: '/api'
        }).then(res => {
            expect(res).toEqual({data: 'test'})
        }).catch(() => {
            expect(false).toBeTruthy()
        })
    })

    it('request failed', () => {
        axios.request.mockRejectedValueOnce()
        return xhr(axios, {}, {
            method: 'GET',
            url: '/api'
        }).then(() => {
            expect(false).toBeTruthy()
        }).catch(() => {
        })
    })

})