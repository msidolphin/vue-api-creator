import { createError, isString, getType } from '@/utils'

describe('utils.js', () => {
    it('createError', () => {
        expect(createError(500, 'ok')).toEqual({
            code: 500,
            msg: 'ok',
            success: false,
            data: undefined,
            response: {},
            config: {},
            request: {}
        })
        expect(createError(500, 'ok', {a: 1}, {b: 2}, {c: 3}, {d: 4})).toEqual({
            code: 500,
            msg: 'ok',
            success: false,
            data: {
                a: 1
            },
            response: {
                b: 2
            },
            config: {
                c: 3
            },
            request: {
                d: 4
            }
        })
    })
    it('isString', () => {
        expect(isString('abc')).toBeTruthy()
        expect(isString('')).toBeTruthy()
        expect(isString([])).toBeFalsy()
    })
    it('getType', () => {
        expect(getType('abc')).toBe('String')
        expect(getType([])).toBe('Array')
        expect(getType({})).toBe('Object')
    })
})